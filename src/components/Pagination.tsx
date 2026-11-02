import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** 1 … 4 5 [6] 7 8 … 20 — always shows first, last, and two neighbours of the current page. */
const pageList = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) out.push('…');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push('…');
  out.push(total);
  return out;
};

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  const { tx, isRTL } = useLanguage();
  if (totalPages <= 1) return null;
  const Prev = isRTL ? ChevronRight : ChevronLeft;
  const Next = isRTL ? ChevronLeft : ChevronRight;
  const btn = 'grid place-items-center min-w-11 h-11 px-3 rounded-full text-[15px] font-semibold transition-colors';

  return (
    <nav aria-label={tx('الصفحات', 'Pagination')} className="flex items-center justify-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label={tx('السابق', 'Previous')}
        className={`${btn} bg-accent text-white enabled:hover:bg-accent-ink disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Prev className="w-5 h-5" />
      </button>

      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-muted">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} num ${p === page ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface'}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label={tx('التالي', 'Next')}
        className={`${btn} bg-accent text-white enabled:hover:bg-accent-ink disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Next className="w-5 h-5" />
      </button>
    </nav>
  );
};
