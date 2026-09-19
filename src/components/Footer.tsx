import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenBrandShowcase?: () => void;
  onOpenAddUnit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <footer className="bg-[#0f172a] text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0f766e] flex items-center justify-center text-white font-black">
                <span className="text-base text-white font-mono">⧉</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white">
                  {language === 'ar' ? currentBrand.nameAr : currentBrand.nameEn}
                </span>
                <span className="text-[10px] font-bold text-[#2dd4bf] bg-white/10 px-1.5 py-0.5 rounded">
                  {language === 'ar' ? currentBrand.nameEn : currentBrand.nameAr}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {language === 'ar' 
                ? 'منصة التنازل عن وحدات التقسيط بدون أوفر — البايع يسترجع فلوسه كاش، والمشتري ياخد سعر التعاقد القديم، وإحنا بنسهّل الإجراءات خطوة بخطوة لحد الإتمام بمقر المطور.'
                : 'The official installment contract transfer marketplace with zero overprice. Sellers recover 100% of their paid cash; buyers acquire legacy contracts directly at developer HQ.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-white bg-white/10 px-2.5 py-1 rounded-md font-bold">
                {language === 'ar' ? 'مجانًا للبايع 0%' : 'Free for Sellers 0%'}
              </span>
              <span className="text-[#2dd4bf] bg-[#0f766e]/20 px-2.5 py-1 rounded-md font-bold">
                {language === 'ar' ? '1.25% على المشتري بس' : '1.25% Buyer Commission'}
              </span>
              <span className="text-slate-300 bg-white/5 px-2.5 py-1 rounded-md">
                {t('noOverpriceBadge')}
              </span>
            </div>
          </div>

          {/* Nav: صفحات المنصة */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wide">
              {language === 'ar' ? 'صفحات المنصة' : 'Marketplace'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('opportunities')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('opportunities')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('sell')} 
                  className="hover:text-white transition-colors cursor-pointer text-[#2dd4bf] font-bold"
                >
                  {t('sellUnit')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('investors')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('forInvestors')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('how-it-works')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('howItWorks')}
                </button>
              </li>
            </ul>
          </div>

          {/* Nav: الشركة & الأسماء */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wide">
              {language === 'ar' ? 'الشركة والاتصال' : 'Company'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('story')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('ourStory')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('contactUs')}
                </button>
              </li>
              <li>
                <a href="tel:19822" className="hover:text-white transition-colors">
                  {language === 'ar' ? 'الخط الساخن: 19822' : 'Hotline: 19822'}
                </a>
              </li>
            </ul>
          </div>

          {/* الدولة والتواصل */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wide">
              {language === 'ar' ? 'الدولة والتواجد' : 'Presence'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0d9488]"></span>
                <span>{language === 'ar' ? 'مصر (المقر الرئيسي)' : 'Egypt (Headquarters)'}</span>
              </div>
              <div className="text-slate-500">
                {t('countryKSA')} <span className="text-[10px] bg-white/10 text-slate-400 px-1.5 py-0.5 rounded">{t('soon')}</span>
              </div>
              <div className="text-slate-500">
                {t('countryUAE')} <span className="text-[10px] bg-white/10 text-slate-400 px-1.5 py-0.5 rounded">{t('soon')}</span>
              </div>
              <div className="pt-2 text-slate-300">
                {language === 'ar' ? 'شارع التسعين الشمالي، التجمع الخامس، القاهرة' : 'North 90th St, New Cairo, Egypt'}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {language === 'ar' ? currentBrand.nameAr : currentBrand.nameEn} ({language === 'ar' ? currentBrand.nameEn : currentBrand.nameAr}). {language === 'ar' ? 'نموذج التنازل الآمن بدون أوفر برايس.' : 'Safe installment transfer model with 0% overprice.'}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('story')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('ourStory')}
            </button>
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('howItWorks')}
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              {t('contactUs')}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
