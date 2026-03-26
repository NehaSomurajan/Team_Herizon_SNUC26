const BASE_URL = "http://localhost:3000";

export const getUser = async (id) => {
  const res = await fetch(`${BASE_URL}/user/${id}`);
  return res.json();
};

export const checkIn = async (data) => {
  const res = await fetch(`${BASE_URL}/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (name) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const getUserById = async (id) => {
  const res = await fetch(`http://localhost:3000/user/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};