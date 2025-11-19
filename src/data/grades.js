const gradesData = {
  semesters: [
    {
      sem: "Semester 1",
      gpa: 8.9,
      courses: [
        { code: "CS101", name: "Introduction to Programming", credits: 4, grade: "A" },
        { code: "MA101", name: "Calculus", credits: 4, grade: "A-" },
        { code: "PH101", name: "Physics", credits: 4, grade: "B+" }
      ]
    },

    {
      sem: "Semester 2",
      gpa: 8.7,
      courses: [
        { code: "CS201", name: "Data Structures", credits: 4, grade: "A" },
        { code: "MA102", name: "Linear Algebra", credits: 4, grade: "A-" },
        { code: "EE101", name: "Basic Electronics", credits: 3, grade: "B" }
      ]
    },

    {
      sem: "Semester 3",
      gpa: 9.1,
      courses: [
        { code: "CS301", name: "Algorithms", credits: 4, grade: "A+" },
        { code: "CS302", name: "Operating Systems", credits: 4, grade: "A" },
        { code: "MA204", name: "Discrete Math", credits: 4, grade: "A-" }
      ]
    }
  ]
};

export default gradesData;
