import React, { useState } from 'react';
import { 
  Star, 
  ChevronDown, 
  HelpCircle, 
  MessageSquareQuote 
} from 'lucide-react';
import { TESTIMONIALS, FAQS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const TestimonialsAndFaq: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Testimonials Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold mb-2 border border-[#d1fae5]">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تجارب حقيقية' : 'Verified Reviews'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {language === 'ar' 
                ? 'قصص نجاح في التنازل والشراء بدون أوفر' 
                : 'Success Stories: 0% Overprice & Safe Cash Exits'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ar'
                ? 'آراء حقيقية من بائعين استردوا فلوسهم كاملة، ومستثمرين اشتروا بسعر التعاقد القديم.'
                : 'Real experiences from sellers who recovered 100% of their cash and buyers who secured past contract pricing.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className={`bg-[#f5f6f8] p-5 rounded-2xl border border-[#e5e7eb] flex flex-col justify-between space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{language === 'en' && t.quoteEn ? t.quoteEn : t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">
                      {language === 'en' && t.authorEn ? t.authorEn : t.author}
                    </h4>
                    <span className="text-[11px] text-[#0f766e] font-medium block">
                      {language === 'en' && t.roleEn ? t.roleEn : t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div id="faq" className="max-w-3xl mx-auto pt-6 border-t border-[#e5e7eb]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {language === 'ar' 
                ? 'كل اللي محتاج تعرفه عن التنازل والعمولات' 
                : 'Everything You Need to Know About Contract Transfer & Fees'}
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const question = language === 'en' && faq.qEn ? faq.qEn : faq.q;
              const answer = language === 'en' && faq.aEn ? faq.aEn : faq.a;

              return (
                <div 
                  key={idx}
                  className="bg-[#f5f6f8] rounded-xl border border-[#e5e7eb] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-4 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0f172a] hover:bg-slate-100 transition-colors cursor-pointer`}
                  >
                    <span>{question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0f766e]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className={`px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white ${isRTL ? 'text-right' : 'text-left'}`}>
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
