export interface SamplePreset {
  id: string;
  label: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "frontend-intern",
    label: "Frontend Developer",
    resumeText: `AARAV SHARMA
Bengaluru, India | aarav.sharma@email.com | github.com/aaravsharma | linkedin.com/in/aaravsharma

EDUCATION
B.Tech in Computer Science & Engineering, RV College of Engineering (2022 - 2026)
CGPA: 8.6 / 10

SKILLS
Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python
Frameworks & Libraries: React, Tailwind CSS, Express.js, Node.js
Tools: Git, GitHub, VS Code, Figma, Postman

PROJECTS
Campus Event Portal | React, Tailwind CSS, Node.js
- Built a web app for college clubs to publish events and manage student RSVPs.
- Designed responsive layouts and integrated REST APIs for event registration.

Weather & Air Quality Tracker | JavaScript, HTML, CSS
- Created a single-page weather dashboard fetching live city forecasts from OpenWeather API.
- Implemented local storage caching to save recent city searches.

EXPERIENCE
Web Development Intern, PixelCraft Studio (May 2025 - Jul 2025)
- Assisted in building landing pages using React and Tailwind CSS.
- Fixed UI alignment bugs across mobile and desktop viewports.`,
    jobDescription: `Frontend Developer (React / TypeScript) — Entry Level
Location: Bengaluru (Hybrid)

About the Role:
We are looking for a Frontend Developer to build fast, accessible web interfaces for our SaaS analytics platform.

Required Qualifications:
- Strong proficiency in React, TypeScript, and modern JavaScript (ES6+).
- Experience with Tailwind CSS or modern CSS architecture and responsive design.
- Familiarity with REST APIs, async state management, and Git version control.
- Understanding of web accessibility (WCAG), unit testing (Jest / Vitest), and performance optimization.

Preferred Qualifications:
- Experience with Next.js or Vite build tooling.
- Familiarity with CI/CD pipelines, Docker, or GraphQL.
- Track record of quantified performance or usability improvements in projects.`,
  },
  {
    id: "data-analyst",
    label: "Data Analyst",
    resumeText: `PRIYA NAIR
Hyderabad, India | priya.nair@email.com | linkedin.com/in/priyanair

EDUCATION
B.Sc. in Statistics & Data Science, Osmania University (2022 - 2025)

TECHNICAL SKILLS
Python (Pandas, NumPy), SQL (MySQL), Microsoft Excel (Pivot Tables, VLOOKUP), Matplotlib

PROJECTS
Retail Sales Analysis
- Cleaned a dataset of 15,000 retail transactions using Python Pandas.
- Created monthly revenue charts in Matplotlib to identify top-selling product categories.

Student Attendance Tracker
- Built an Excel workbook using pivot tables to summarize attendance across 4 semesters.`,
    jobDescription: `Junior Data Analyst
We are hiring a Junior Data Analyst to transform business data into clear executive dashboards and insights.

Requirements:
- Strong SQL querying skills (joins, window functions, CTEs, aggregations).
- Proficiency in Python (Pandas, NumPy) or R for data cleaning and exploratory analysis.
- Hands-on experience building interactive dashboards in Power BI or Tableau.
- Solid foundation in A/B testing, statistical hypothesis testing, and Excel modeling.
- Ability to communicate business recommendations with quantified KPIs.`,
  },
];
