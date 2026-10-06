import React from 'react';
import { X, Check, Palette, Sparkles, LayoutGrid } from 'lucide-react';
import { useLogo, LOGO_OPTIONS, LogoVariant } from '../context/LogoContext';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export const LogoPickerModal: React.FC = () => {
  const { logoVariant, setLogoVariant, isPickerOpen, setIsPickerOpen } = useLogo();
  const { language, tx } = useLanguage();

  if (!isPickerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="card w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface border border-line shadow-2xl rounded-3xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between gap-4 bg-paper/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-ink">
                {tx('اختر تصميم شعار المنصة (Logo Showcase)', 'Select Platform Logo Design')}
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                {tx(
                  'جميع التصميمات تضع اسم FORSA بالإنجليزية في الأعلى والأكبر، مع اسم "فرصة" بالعربية.',
                  'All designs feature English FORSA on top & larger, paired with Arabic.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPickerOpen(false)}
            className="grid place-items-center w-9 h-9 rounded-full bg-surface hover:bg-line text-ink-soft hover:text-ink transition shadow-xs"
            aria-label={tx('إغلاق', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Cards List */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOGO_OPTIONS.map((option) => {
              const isSelected = logoVariant === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => setLogoVariant(option.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                    isSelected
                      ? 'border-brand bg-brand-soft/20 shadow-md ring-2 ring-brand/10'
                      : 'border-line bg-paper/60 hover:bg-paper hover:border-brand/40 hover:shadow-xs'
                  }`}
                >
                  {/* Top info and status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-extrabold text-brand bg-brand-soft px-2.5 py-1 rounded-full">
                        {option.badge}
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          <span>{tx('المُختار حالياً', 'Active')}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-ink">
                      {language === 'ar' ? option.nameAr : option.nameEn}
                    </h3>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                      {language === 'ar' ? option.descriptionAr : option.descriptionEn}
                    </p>
                  </div>

                  {/* Visual Previews in Light & Dark backgrounds */}
                  <div className="space-y-2 pt-2 border-t border-line/60">
                    <div className="text-[11px] font-semibold text-muted flex items-center justify-between">
                      <span>{tx('معاينة في الموقع (نهاري / ليلي):', 'Preview (Light / Dark):')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Light Navbar background */}
                      <div className="p-3 rounded-xl bg-surface border border-line flex items-center justify-center min-h-[64px]">
                        <Logo forcedVariant={option.id} />
                      </div>

                      {/* Dark Footer background */}
                      <div className="p-3 rounded-xl bg-brand-ink border border-white/10 flex items-center justify-center min-h-[64px]">
                        <Logo forcedVariant={option.id} light />
                      </div>
                    </div>
                  </div>

                  {/* Selection Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoVariant(option.id);
                    }}
                    className={`w-full min-h-10 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand text-white shadow-xs'
                        : 'bg-surface border border-line text-ink hover:border-brand hover:text-brand'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{tx('هذا هو الشعار المعتمد', 'Selected Logo')}</span>
                      </>
                    ) : (
                      <>
                        <span>{tx('اختيار وتطبيق هذا الشعار', 'Select This Logo')}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-paper border-t border-line flex items-center justify-between text-xs sm:text-sm">
          <span className="text-ink-soft">
            {tx('التصميم المختار يطبق فوراً على الهيدر، الفوتر، وكل شاشات المنصة.', 'Selection updates instantly across header, footer & all screens.')}
          </span>
          <button
            type="button"
            onClick={() => setIsPickerOpen(false)}
            className="btn-primary min-h-9 px-5 text-xs font-bold shadow-xs"
          >
            {tx('تم وتطبيق', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
