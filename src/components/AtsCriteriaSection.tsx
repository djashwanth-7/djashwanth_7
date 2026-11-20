export function AtsCriteriaSection() {
  const criteria = [
    {
      num: "01",
      title: "Exact Keyword & Skill Alignment",
      description:
        "Applicant Tracking Systems score resumes by matching core tools, languages, and frameworks directly against the job description. Mirror standard terminology rather than vague synonyms.",
    },
    {
      num: "02",
      title: "Quantified Project Outcomes",
      description:
        "Recruiters scan for measurable impact—numbers like latency reduced, users served, dataset size processed, or test coverage achieved stand out immediately.",
    },
    {
      num: "03",
      title: "Single-Column PDF Readability",
      description:
        "Clean section headings (Education, Skills, Projects, Experience) and selectable PDF text prevent automated parsers from scrambling or dropping key details.",
    },
    {
      num: "04",
      title: "Targeted Role Tailoring",
      description:
        "Ordering your most relevant project first and removing unrelated coursework helps both automated filters and human reviewers verify fit within six seconds.",
    },
  ];

  return (
    <section
      id="ats-criteria"
      className="max-w-[1320px] mx-auto px-6 py-12 border-t border-slate-200 mt-8"
    >
      <div className="max-w-2xl mb-8">
        <h2 className="text-xl font-semibold text-slate-900">
          How ATS Screening Evaluates Your Resume
        </h2>
        <p className="text-sm text-slate-600 mt-1.5">
          Four fundamentals that determine whether your application advances to a
          technical interview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {criteria.map((item) => (
          <div
            key={item.num}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
              {item.num}
            </span>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
