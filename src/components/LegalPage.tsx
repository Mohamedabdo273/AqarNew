import { withBrand } from './BrandWord';
import React, { useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BRAND, whatsappLink } from '../config/brand';

export interface LegalSection {
  id: string;
  title: string;
  /** Paragraphs; a string starting with "• " renders as a bullet. */
  body: string[];
}

interface LegalPageProps {
  title: string;
  updated: string;
  summaryTitle: string;
  summary: string[];
  sections: LegalSection[];
  footer?: React.ReactNode;
}

/** Shared layout for long legal text: plain-language summary first, then numbered sections with a contents list. */
export const LegalPage: React.FC<LegalPageProps> = ({ title, updated, summaryTitle, summary, sections, footer }) => {
  const { tx } = useLanguage();

  const [tocOpen, setTocOpen] = useState(false);

  const jump = (id: string) => {
    setTocOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted">
        <CalendarDays className="w-4 h-4" />
        {tx('آخر تحديث', 'Last updated')}: <span className="num">{updated}</span>
      </p>

      {/* The short version, for people who won't read the rest. */}
      <div className="mt-8 rounded-card bg-brand-soft p-6 sm:p-7">
        <p className="font-bold text-brand-ink">{summaryTitle}</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3">
          {summary.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-ink">
              <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 grid lg:grid-cols-[15rem_1fr] gap-8 items-start">
        <nav aria-label={tx('المحتويات', 'Contents')} className="lg:sticky lg:top-24 card p-4">
          {/* Collapsed on phones so the text isn't pushed below a long list. */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            aria-expanded={tocOpen}
            className="w-full flex items-center justify-between px-2 pb-2 text-sm font-bold text-muted lg:pointer-events-none"
          >
            {tx(`المحتويات (${sections.length})`, `Contents (${sections.length})`)}
            <ChevronDown className={`w-4 h-4 lg:hidden transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
          </button>
          <ol className={`${tocOpen ? 'block' : 'hidden'} lg:block max-h-[60vh] overflow-y-auto`}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <button onClick={() => jump(s.id)} className="w-full text-start rounded-xl px-2 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink">
                  <span className="num text-muted me-1.5">{i + 1}.</span>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="card p-6 sm:p-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-ink">
                <span className="num text-brand me-2">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-ink-soft leading-loose">
                {s.body.map((p, j) =>
                  p.startsWith('• ') ? (
                    <p key={j} className="flex items-start gap-3 ps-1">
                      <span className="mt-3 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                      <span>{p.slice(2)}</span>
                    </p>
                  ) : (
                    <p key={j}>{withBrand(p)}</p>
                  )
                )}
              </div>
            </section>
          ))}

          {footer}

          <div className="rounded-xl bg-paper p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="font-semibold text-ink">{tx('عندك سؤال عن الكلام ده؟', 'Questions about this?')}</p>
            <div className="flex gap-3">
              <a href={`tel:${BRAND.hotline}`} className="btn-ghost min-h-11 px-4">
                <Phone className="w-4 h-4 text-brand" />
                {BRAND.hotline}
              </a>
              <a href={whatsappLink(tx(`سؤال عن ${title}`, `Question about ${title}`))} target="_blank" rel="noreferrer" className="btn-primary min-h-11 px-4">
                <MessageCircle className="w-4 h-4" />
                {tx('واتساب', 'WhatsApp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
