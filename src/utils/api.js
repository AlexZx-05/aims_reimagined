import coursesData from "../data/courses";
import registrationData from "../data/registration";
import gradesData from "../data/grades";
import favoritesData from "../data/favorites";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

function seedIfMissing(key, value) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function initMockData() {
  seedIfMissing("courses", coursesData);
  seedIfMissing("registrationInfo", registrationData);
  seedIfMissing("grades", gradesData);
  seedIfMissing("favorites", favoritesData);
}

// Courses
export async function getCourses() {
  await delay();
  initMockData();
  return JSON.parse(localStorage.getItem("courses") || "[]");
}

export async function getCourse(id) {
  const courses = await getCourses();
  return courses.find((c) => c.id === id) || null;
}

// Registration (per-user)
function regKey(userId) {
  return `registrations_user_${userId}`;
}

export async function getRegistrations(userId) {
  await delay();
  initMockData();
  const raw = localStorage.getItem(regKey(userId));
  return raw ? JSON.parse(raw) : [];
}

export async function addRegistration(userId, courseId) {
  await delay();
  const courses = JSON.parse(localStorage.getItem("courses") || "[]");
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw new Error("Course not found");
  if (course.filledSeats >= course.totalSeats) throw new Error("No seats available");

  // update course seats
  course.filledSeats = (course.filledSeats || 0) + 1;
  localStorage.setItem("courses", JSON.stringify(courses));

  const regs = await getRegistrations(userId);
  if (regs.find((r) => r === courseId)) return regs;
  const updated = [...regs, courseId];
  localStorage.setItem(regKey(userId), JSON.stringify(updated));
  return updated;
}

export async function dropRegistration(userId, courseId) {
  await delay();
  const courses = JSON.parse(localStorage.getItem("courses") || "[]");
  const course = courses.find((c) => c.id === courseId);
  if (course) {
    course.filledSeats = Math.max(0, (course.filledSeats || 0) - 1);
    localStorage.setItem("courses", JSON.stringify(courses));
  }

  const regs = await getRegistrations(userId);
  const updated = regs.filter((r) => r !== courseId);
  localStorage.setItem(regKey(userId), JSON.stringify(updated));
  return updated;
}

// Grades
export async function getGrades(userId) {
  await delay();
  initMockData();
  const raw = localStorage.getItem(`grades_user_${userId}`);
  if (raw) return JSON.parse(raw);
  // seed from gradesData -> store per user
  const seed = gradesData;
  localStorage.setItem(`grades_user_${userId}`, JSON.stringify(seed));
  return seed;
}

export async function updateGrades(userId, newGrades) {
  await delay();
  localStorage.setItem(`grades_user_${userId}`, JSON.stringify(newGrades));
  return newGrades;
}

// Favorites
function favKey(userId) {
  return `favorites_user_${userId}`;
}

export async function getFavorites(userId) {
  await delay();
  initMockData();
  const raw = localStorage.getItem(favKey(userId));
  if (raw) return JSON.parse(raw);
  const seed = favoritesData;
  localStorage.setItem(favKey(userId), JSON.stringify(seed));
  return seed;
}

export async function toggleFavorite(userId, category, item) {
  await delay();
  const favs = await getFavorites(userId);
  const list = favs[category] || [];
  const exists = list.find((i) => i.id === item.id);
  let updatedList;
  if (exists) {
    updatedList = list.filter((i) => i.id !== item.id);
  } else {
    updatedList = [...list, item];
  }
  favs[category] = updatedList;
  localStorage.setItem(favKey(userId), JSON.stringify(favs));
  return favs;
}

// Expose registration info
export async function getRegistrationInfo() {
  await delay();
  initMockData();
  return JSON.parse(localStorage.getItem("registrationInfo") || "{}");
}

export default {
  initMockData,
  getCourses,
  getCourse,
  getRegistrations,
  addRegistration,
  dropRegistration,
  getGrades,
  updateGrades,
  getFavorites,
  toggleFavorite,
  getRegistrationInfo,
};
