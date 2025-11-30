// src/data/courses.js

// Base registration window (change these if you want a different period)
const BASE_REGISTRATION_START = "2025-08-01"; // registration opens
const BASE_REGISTRATION_END = "2025-08-15"; // registration closes

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

/**
 * Compute registration and drop dates for a course based on its creditType.
 * creditType is expected to be a string like "1", "2", "3" — convert to Number.
 * Drop date = registrationEndDate + (credit * 7 days)
 */
function computeDatesForCredit(creditType) {
  const creditNum = Number(creditType) || 0;
  const regStart = new Date(BASE_REGISTRATION_START);
  const regEnd = new Date(BASE_REGISTRATION_END);

  // Drop date offset: 1-credit -> +7 days, 2-credit -> +14 days, 3-credit -> +21 days
  const dropOffset = creditNum * ONE_WEEK_MS;

  const dropDate = new Date(regEnd.getTime() + dropOffset);

  // Return as ISO date (YYYY-MM-DD)
  const toIsoDate = (d) => d.toISOString().split("T")[0];

  return {
    registrationDate: toIsoDate(regStart),
    registrationEndDate: toIsoDate(regEnd),
    dropDate: toIsoDate(dropDate),
  };
}

const rawCourses = [
  // ===== SEMESTER 1 =====
  // Departmental Core - 3 Credits
  {
    id: "CS101",
    name: "Programming Fundamentals",
    faculty: "Dr. Shreya Kulkarni",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 60,
    filledSeats: 45,
  },
  {
    id: "CS102",
    name: "Data Structures",
    faculty: "Prof. Vivek Sharma",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 60,
    filledSeats: 55,
  },
  {
    id: "CS105",
    name: "Discrete Mathematics",
    faculty: "Dr. Ramesh Kumar",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 60,
    filledSeats: 50,
  },
  // Departmental Core - 1 Credit
  {
    id: "CS103",
    name: "Programming Lab",
    faculty: "Dr. Anjali Rao",
    credits: 1,
    semester: 1,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 28,
  },
  {
    id: "CS106",
    name: "Introduction Lab",
    faculty: "Prof. Suresh Singh",
    credits: 1,
    semester: 1,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 20,
  },
  // Elective - 3 Credits
  {
    id: "CS104",
    name: "Web Development Basics",
    faculty: "Dr. Karthik M",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 25,
  },
  {
    id: "CS107",
    name: "Game Development Intro",
    faculty: "Dr. Priya Desai",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Elective",
    totalSeats: 35,
    filledSeats: 32,
  },
  {
    id: "CS108",
    name: "Cloud Computing Basics",
    faculty: "Mr. Arun Patel",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 38,
  },
  // Liberal Arts - 3 Credits
  {
    id: "HS101",
    name: "Professional Ethics",
    faculty: "Prof. Nisha K",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 60,
  },
  {
    id: "HS102",
    name: "History of Technology",
    faculty: "Dr. Mohan Singh",
    credits: 3,
    semester: 1,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 55,
  },

  // ===== SEMESTER 2 =====
  // Departmental Core - 3 Credits
  {
    id: "CS201",
    name: "Database Management Systems",
    faculty: "Dr. Shreya Kulkarni",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 60,
    filledSeats: 50,
  },
  {
    id: "CS202",
    name: "Operating Systems",
    faculty: "Prof. Vivek Sharma",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 50,
    filledSeats: 49,
  },
  {
    id: "CS205",
    name: "Object Oriented Programming",
    faculty: "Dr. Rajesh Kumar",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 55,
    filledSeats: 45,
  },
  {
    id: "CS206",
    name: "Data Communication",
    faculty: "Dr. Meera Nair",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 50,
    filledSeats: 40,
  },
  // Departmental Core - 1 Credit
  {
    id: "CS203",
    name: "DBMS Lab",
    faculty: "Dr. Anjali Rao",
    credits: 1,
    semester: 2,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 27,
  },
  {
    id: "CS207",
    name: "OS Lab",
    faculty: "Prof. Suresh Singh",
    credits: 1,
    semester: 2,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 25,
  },
  // Elective - 3 Credits
  {
    id: "CS204",
    name: "Mobile App Development",
    faculty: "Dr. Karthik M",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 32,
  },
  {
    id: "CS208",
    name: "Blockchain Fundamentals",
    faculty: "Dr. Vikram Reddy",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Elective",
    totalSeats: 35,
    filledSeats: 30,
  },
  {
    id: "CS209",
    name: "Cybersecurity Basics",
    faculty: "Ms. Pooja Sharma",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 28,
  },
  {
    id: "CS210",
    name: "IoT Applications",
    faculty: "Dr. Harish Gupta",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Elective",
    totalSeats: 38,
    filledSeats: 35,
  },
  // Liberal Arts - 3 Credits
  {
    id: "HS201",
    name: "Communication Skills",
    faculty: "Prof. Nisha K",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 65,
  },
  {
    id: "HS202",
    name: "Technical Writing",
    faculty: "Dr. Anjana Saxena",
    credits: 3,
    semester: 2,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 50,
  },

  // ===== SEMESTER 3 =====
  // Departmental Core - 3 Credits
  {
    id: "CS301",
    name: "Computer Networks",
    faculty: "Dr. Shreya Kulkarni",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 55,
    filledSeats: 55,
  },
  {
    id: "CS302",
    name: "Software Engineering",
    faculty: "Prof. Vivek Sharma",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 50,
    filledSeats: 40,
  },
  {
    id: "CS305",
    name: "Theory of Computation",
    faculty: "Dr. Ramesh Kumar",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 50,
    filledSeats: 35,
  },
  {
    id: "CS306",
    name: "Compiler Design",
    faculty: "Dr. Naveen Kulkarni",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Departmental Core",
    totalSeats: 45,
    filledSeats: 38,
  },
  // Departmental Core - 1 Credit
  {
    id: "CS303",
    name: "Networking Lab",
    faculty: "Dr. Anjali Rao",
    credits: 1,
    semester: 3,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 25,
  },
  {
    id: "CS307",
    name: "Software Engineering Lab",
    faculty: "Prof. Suresh Singh",
    credits: 1,
    semester: 3,
    creditType: "1",
    category: "Departmental Core",
    totalSeats: 30,
    filledSeats: 22,
  },
  // Elective - 3 Credits
  {
    id: "CS304",
    name: "Artificial Intelligence",
    faculty: "Dr. Karthik M",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 38,
  },
  {
    id: "CS308",
    name: "Machine Learning",
    faculty: "Dr. Priya Desai",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Elective",
    totalSeats: 38,
    filledSeats: 36,
  },
  {
    id: "CS309",
    name: "Natural Language Processing",
    faculty: "Dr. Vikram Reddy",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Elective",
    totalSeats: 35,
    filledSeats: 30,
  },
  {
    id: "CS310",
    name: "Computer Vision",
    faculty: "Ms. Pooja Sharma",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Elective",
    totalSeats: 40,
    filledSeats: 32,
  },
  {
    id: "CS311",
    name: "Web Services & APIs",
    faculty: "Mr. Arun Patel",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Elective",
    totalSeats: 42,
    filledSeats: 38,
  },
  // Liberal Arts - 3 Credits
  {
    id: "HS301",
    name: "Environmental Science",
    faculty: "Prof. Nisha K",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 55,
  },
  {
    id: "HS302",
    name: "Entrepreneurship",
    faculty: "Dr. Mohan Singh",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 48,
  },
  {
    id: "HS303",
    name: "Legal Aspects of IT",
    faculty: "Dr. Anjana Saxena",
    credits: 3,
    semester: 3,
    creditType: "3",
    category: "Liberal Arts",
    totalSeats: 70,
    filledSeats: 42,
  },
];

const coursesData = rawCourses.map((course) => {
  const dates = computeDatesForCredit(course.creditType);
  return {
    ...course,
    ...dates,
  };
});

export default coursesData;
