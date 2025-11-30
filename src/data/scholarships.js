const scholarshipsData = {
  available: [
    {
      id: "NSP-001",
      name: "National Scholarship Portal",
      amount: "₹50,000",
      deadline: "30 Oct 2025",
      description: "Central Government financial assistance for meritorious students.",
       link: "https://scholarships.gov.in/Students"
    },
    {
      id: "PMSS-002",
      name: "Prime Minister Special Scholarship",
      amount: "₹70,000",
      deadline: "10 Nov 2025",
      description: "Support for economically weaker sections of society.",
       link: "https://www.desw.gov.in/prime-ministers-scholarship-scheme-pmss"
    },
    {
      id: "ME-003",
      name: "Merit-Based Excellence Award",
      amount: "₹25,000",
      deadline: "15 Nov 2025",
      description: "Awarded based on high CGPA performance.",
       link: "https://www.alliance.edu.in/admissions/scholarships"

    }
  ],

  applied: [
    {
      name: "National Scholarship Portal",
      status: "Pending",
      date: "15 Oct 2025",
    },
    {
      name: "Merit-Based Excellence Award",
      status: "Approved",
      date: "18 Sep 2025",
    }
  ]
};

export default scholarshipsData;
