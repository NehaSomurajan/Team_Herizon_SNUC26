import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn"; // Add SignIn page import
import DashboardLayout from "./pages/DashboardLayout";
import Stats from "./components/StatsCards";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Help from "./pages/Help";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* SignIn - for new user creation */}
        <Route path="/signin" element={<SignIn />} />

        {/* Dashboard Layout with Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Redirect /dashboard to /dashboard/home */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="stats" element={<Stats />} />
          <Route path="groups" element={<Groups />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* Catch-all: redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;