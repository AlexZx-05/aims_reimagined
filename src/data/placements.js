// src/data/placements.js
const placementsData = {
  userCGPA: 8.7,

  companies: [
    {
      id: "C01",
      name: "Google",
      role: "Software Engineer",
      ctc: "38 LPA",
      location: "Bangalore",
      minCGPA: 8.0,
      logo: "/companies/google.jpeg",
      description:
        "Work on large-scale distributed systems, design and implement features, and collaborate with cross-functional teams.",
      requirements: [
        "Strong knowledge of data structures & algorithms",
        "Systems design understanding",
        "Proficiency in at least one programming language (C++/Java/Python)",
      ],
      assessmentDate: "2025-12-05",
      interviewTimeline: "Aptitude → Technical rounds → HR"
    },
    {
      id: "C02",
      name: "Amazon",
      role: "SDE 1",
      ctc: "32 LPA",
      location: "Hyderabad",
      minCGPA: 7.5,
      logo: "/companies/amazon.jpeg",
      description:
        "Build reliable services and customer-facing products; focus on scalable code and operational excellence.",
      requirements: [
        "Solid coding skills",
        "Knowledge of distributed systems and databases",
        "Good problem solving and communication"
      ],
      assessmentDate: "2025-12-10",
      interviewTimeline: "Online test → Technical interviews → HR"
    },
    {
      id: "C03",
      name: "Intel",
      role: "Verification Engineer",
      ctc: "18 LPA",
      location: "Bangalore",
      minCGPA: 7.0,
      logo: "/companies/intel.jpeg",
      description:
        "Work on RTL verification, write testbenches, and collaborate with chip design teams to ensure quality.",
      requirements: [
        "Knowledge of digital design & verification",
        "Experience with SystemVerilog/UVM (preferred)",
        "Scripting skills (Python/perl) desirable"
      ],
      assessmentDate: "2025-12-12",
      interviewTimeline: "Test → Technical interviews → Manager round"
    },
    {
      id: "C04",
      name: "TCS Digital",
      role: "Software Developer",
      ctc: "7 LPA",
      location: "Chennai",
      minCGPA: 6.0,
      logo: "/companies/tcs.jpeg",
      description:
        "Work on enterprise solutions, product engineering, and customer projects across cloud and web technologies.",
      requirements: [
        "Basic programming & web fundamentals",
        "Comfortable with JavaScript/Java/.NET",
        "Good communication skills"
      ],
      assessmentDate: "2025-12-20",
      interviewTimeline: "Aptitude → Technical → HR"
    }
  ]
};

export default placementsData;
