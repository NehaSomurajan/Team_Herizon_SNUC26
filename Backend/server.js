// =========================
// HABIT APP BACKEND (FIXED)
// =========================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors()); // ✅ IMPORTANT

// =========================
// DB CONNECTION
// =========================
mongoose.connect(
  'mongodb://priyagp2497_db_user:herizon123@ac-roxqjd0-shard-00-00.alunj8r.mongodb.net:27017,ac-roxqjd0-shard-00-01.alunj8r.mongodb.net:27017,ac-roxqjd0-shard-00-02.alunj8r.mongodb.net:27017/habitApp?ssl=true&replicaSet=atlas-1lyqje-shard-0&authSource=admin&appName=herizon'
)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// =========================
// SCHEMAS
// =========================

// USER
const userSchema = new mongoose.Schema({
  name: String,
  profilePic: String,
  streak: { type: Number, default: 0 },
  badges: [String],
  helperScore: { type: Number, default: 0 },
  pauseCount: { type: Number, default: 0 },
  helpedCount: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// GROUP
const groupSchema = new mongoose.Schema({
  name: String,
  habit: String,
  duration: Number,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);

// CHECK-IN
const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  content: String,
  proofImage: String,
  date: { type: Date, default: Date.now }
});

const CheckIn = mongoose.model('CheckIn', checkinSchema);

// HELP
const helpSchema = new mongoose.Schema({
  learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  helperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  message: String,
  status: { type: String, default: 'pending' },
  rating: Number
});

const Help = mongoose.model('Help', helpSchema);

// =========================
// BADGE SYSTEM
// =========================

function assignBadges(user) {
  const badges = [];

  if (user.streak >= 7) badges.push("7 Day Streak");
  if (user.streak >= 30) badges.push("30 Day Streak");
  if (user.streak >= 100) badges.push("100 Day Streak");

  if (user.helperScore >= 4 && user.helpedCount >= 5)
    badges.push("Trusted Voice");

  if (user.helpedCount >= 10)
    badges.push("Mentor");

  return badges;
}

// =========================
// ROUTES
// =========================

// ✅ LOGIN (VERY IMPORTANT FOR FRONTEND)
app.post('/login', async (req, res) => {
  try {
    const { name } = req.body;

    let user = await User.findOne({ name });

    if (!user) {
      user = new User({ name });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE USER
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE GROUP
app.post('/groups', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JOIN GROUP
app.post('/groups/:groupId/join/:userId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    group.members.push(req.params.userId);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FIXED CHECK-IN (ONLY ONE ROUTE)
app.post('/checkin', async (req, res) => {
  try {
    const checkin = new CheckIn(req.body);
    await checkin.save();

    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $inc: { streak: 1 } },
      { new: true }
    );

    user.badges = assignBadges(user);
    await user.save();

    res.json({ checkin, badges: user.badges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HELP REQUEST
app.post('/help/request', async (req, res) => {
  try {
    const help = new Help(req.body);
    await help.save();
    res.json(help);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ACCEPT HELP
app.post('/help/accept/:id', async (req, res) => {
  try {
    const help = await Help.findById(req.params.id);
    help.helperId = req.body.helperId;
    help.status = 'accepted';
    await help.save();
    res.json(help);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RATE HELPER
app.post('/help/rate/:id', async (req, res) => {
  try {
    const help = await Help.findById(req.params.id);

    help.rating = req.body.rating;
    help.status = 'completed';
    await help.save();

    const helper = await User.findById(help.helperId);

    helper.helperScore =
      ((helper.helperScore * helper.helpedCount) + req.body.rating) /
      (helper.helpedCount + 1);

    helper.helpedCount += 1;

    await helper.save();

    res.json(help);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PAUSE
app.post('/pause/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pauseCount += 1;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LEADERBOARD
app.get('/leaderboard/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members');

    const sorted = group.members.sort((a, b) => b.streak - a.streak);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// SERVER
// =========================
app.listen(3000, () => console.log('🚀 Server running on port 3000'));