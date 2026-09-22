import React from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  Globe, 
  Star 
} from 'lucide-react';
import { BRAND_SUGGESTIONS } from '../data/mockData';
import { BrandSuggestion } from '../types';

interface BrandNameShowcaseProps {
  currentBrand: BrandSuggestion;
  onSelectBrand: (brand: BrandSuggestion) => void;
}

export const BrandNameShowcase: React.FC<BrandNameShowcaseProps> = ({
  currentBrand,
  onSelectBrand
}) => {
  return (
    <section id="brand-showcase" className="py-16 bg-[#0f172a] text-white relative overflow-hidden">
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>هويات وأسماء تجارية مقترحة للمنصة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            اختر <span className="text-[#2dd4bf]">الاسم الأنسب</span> لمنصتك الجديدة
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            حللنا 6 أسماء تجارية عربية مميزة تناسب السوق المصري والخليجي وتمنح المنصة طابعاً مؤسسياً موثوقاً.
            <br />
            <span className="text-[#2dd4bf] font-medium">اضغط على أي اسم لتطبيقه ومعاينة الموقع بالكامل به فوراً!</span>
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRAND_SUGGESTIONS.map((brand) => {
            const isSelected = currentBrand.id === brand.id;

            return (
              <div
                key={brand.id}
                onClick={() => onSelectBrand(brand)}
                className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/95 border-[#0d9488] ring-2 ring-[#0d9488]/40 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      isSelected 
                        ? 'bg-[#0f766e]/30 text-[#2dd4bf] border-[#0f766e]'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {brand.badge}
                    </span>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#2dd4bf]">
                        <Check className="w-3 h-3" />
                        المطبق حالياً
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-baseline gap-2.5">
                      <h3 className="text-2xl font-black text-white">
                        {brand.nameAr}
                      </h3>
                      <span className="text-xs font-bold text-slate-400">
                        {brand.nameEn}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#2dd4bf]">
                      "{brand.taglineAr}"
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-4">
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-[11px] leading-relaxed">{brand.rationale}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      {brand.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <span className="text-[#2dd4bf] font-bold">✓</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{brand.domainIdea.split(' / ')[0]}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBrand(brand);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#0f766e] text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'مطبق على الموقع' : 'تطبيق هذا الاسم'}
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expert Recommendation */}
        <div className="mt-10 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>التوصية النهائية:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              اسم <strong className="text-white">"تَنازُل | Tanazul"</strong> هو الأقوى رسمياً وقانونياً في مصر، وبديله الأكثر عصرية <strong className="text-white">"مَخْرَج | Makhraj"</strong> كترجمة فصحى ومطمئنة لـ Exit.
            </p>
          </div>

          <button
            onClick={() => onSelectBrand(BRAND_SUGGESTIONS[0])}
            className="px-4 py-2 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            تثبيت اسم "تنازل"
          </button>
        </div>

      </div>
    </section>
  );
};
