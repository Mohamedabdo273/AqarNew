import { BadgeCheck, Calculator } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/** Says where a number comes from: checked against documents, or our estimate. */
export function SourceTag({ verified, light = false }: { verified: boolean; light?: boolean }) {
  const { tx } = useLanguage();
  const Icon = verified ? BadgeCheck : Calculator;
  const tone = light
    ? verified
      ? 'bg-emerald-400/20 text-emerald-200'
      : 'bg-white/15 text-white/75'
    : verified
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-line/60 text-muted';
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[10px] font-bold align-middle ${tone}`}
      title={verified ? tx('اتأكدنا منه بالمستندات', 'Checked against documents') : tx('رقم تقديري مننا', 'Our estimate')}
    >
      <Icon className="w-3 h-3" />
      {verified ? tx('متأكد', 'Verified') : tx('تقديري', 'Estimate')}
    </span>
  );
}
