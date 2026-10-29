import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * The one error box every form uses: big, red, announced to screen readers, and scrolled into view when it appears
 * so nobody taps "send" and wonders why nothing happened. Several messages show as a bulleted list.
 */
export const FormError: React.FC<{
  /** One message, a list of missing fields, or nothing (renders nothing). */
  messages?: string | (string | null | undefined | false)[] | null;
  /** Optional heading above the message(s), e.g. "ناقص:". */
  title?: string;
  className?: string;
}> = ({ messages, title, className = '' }) => {
  const list = (Array.isArray(messages) ? messages : [messages]).filter((m): m is string => !!m);
  const ref = useRef<HTMLDivElement>(null);
  const key = list.join('|');

  useEffect(() => {
    if (!key || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [key]);

  if (list.length === 0) return null;
  const many = list.length > 1;
  return (
    <div
      ref={ref}
      role="alert"
      className={`rounded-xl border-2 border-danger bg-danger-soft px-4 py-3.5 flex gap-3 text-danger ${className}`}
    >
      <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" strokeWidth={2.4} />
      <div className="min-w-0 text-base font-semibold leading-relaxed">
        {title && <p className="font-bold">{title}</p>}
        {many ? (
          <ul className={`${title ? 'mt-1' : ''} list-disc ps-5 space-y-0.5`}>
            {list.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : (
          <p>{list[0]}</p>
        )}
      </div>
    </div>
  );
};

/** Inline message under a single field — same weight and colour as FormError, just smaller footprint. */
export const FieldError: React.FC<{ show?: boolean; children: React.ReactNode; id?: string }> = ({ show = true, children, id }) =>
  show ? (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-base font-semibold text-danger">
      <AlertTriangle className="w-4.5 h-4.5 shrink-0" strokeWidth={2.4} />
      {children}
    </p>
  ) : null;
