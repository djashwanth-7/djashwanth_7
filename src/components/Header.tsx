interface HeaderProps {
  onLoadSample: () => void;
  onReset: () => void;
  hasResults: boolean;
}

export function Header({ onLoadSample, onReset, hasResults }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#analyzer"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded-sm"
        >
          ATS Lens
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#analyzer"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Analyzer
          </a>
          <a
            href="#ats-criteria"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            ATS Criteria
          </a>
          <button
            type="button"
            onClick={onLoadSample}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sample Resume
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          {hasResults ? (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              New Analysis
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoadSample}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              Try Sample
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
