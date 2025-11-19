const registrationData = {
  currentSemester: "Semester 5",
  academicYear: "2025-2026",

  windows: [
    { title: "Registration Start Date", date: "01 Aug 2025" },
    { title: "Registration Deadline", date: "07 Aug 2025" },
    { title: "Add / Drop Window", date: "08 – 15 Aug 2025" },
    { title: "Fee Payment Deadline", date: "20 Aug 2025" },
  ],

  documents: [
    { name: "Academic Calendar", link: "/docs/calendar.pdf" },
    { name: "Registration Rules", link: "/docs/rules.pdf" },
    { name: "Course Catalog", link: "/docs/catalog.pdf" },
  ],

  registrationLimits: {
    minCredits: 12,
    maxCredits: 30,
  }
};

export default registrationData;
