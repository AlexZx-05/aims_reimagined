import users from "../data/users";

export function loginUser(email, password) {
  const found = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) return null;

  // Load saved version if exists in localStorage
  const saved = localStorage.getItem("user_" + found.id);
  const user = saved ? JSON.parse(saved) : found;

  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export function saveUserUpdates(updatedUser) {
  localStorage.setItem("user", JSON.stringify(updatedUser));
  localStorage.setItem("user_" + updatedUser.id, JSON.stringify(updatedUser));
}

export function logoutUser() {
  localStorage.removeItem("user");
}
