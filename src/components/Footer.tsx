import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { BRAND, whatsappLink } from '../config/brand';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, tx } = useLanguage();
  const columns: { title: string; links: { id: PageId; l: string }[] }[] = [
    {
      title: tx('المنصة', 'Platform'),
      links: [
        { id: 'opportunities', l: tx('اشتري وحدة', 'Buy a unit') },
        { id: 'sell', l: tx('بيع وحدتك', 'Sell your unit') },
        { id: 'swap', l: tx('بدّل وحدتك', 'Swap your unit') },
        { id: 'saved', l: tx('المفضلة', 'Saved') },
        { id: 'requests', l: tx('حسابي', 'My account') },
        { id: 'compare', l: tx('قارن وحداتك', 'Compare units') },
        { id: 'market-comparisons', l: tx('مقارنات السوق', 'Market comparisons') },
      ],
    },
    {
      title: tx('اعرفنا', 'Company'),
      links: [
        { id: 'about', l: tx('احنا مين', 'About us') },
        { id: 'rules', l: tx('ضمان حقك', 'Your protection') },
        { id: 'verify', l: tx('اتأكد من وحدة', 'Verify a unit') },
        { id: 'contact', l: tx('كلمنا', 'Contact us') },
        { id: 'terms', l: tx('الشروط والأحكام', 'Terms & conditions') },
        { id: 'privacy', l: tx('سياسة الخصوصية', 'Privacy policy') },
      ],
    },
  ];

  return (
    <footer className="bg-brand-ink text-white/80 pb-20 md:pb-0">
      <div className="page-wrap py-10 sm:py-12 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo light size="sm" onClick={() => onNavigate('home')} />
          <p className="mt-3 text-sm leading-relaxed max-w-xs">{language === 'ar' ? BRAND.taglineAr : BRAND.taglineEn}</p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} className="flex flex-col">
            <p className="font-semibold text-white mb-1">{c.title}</p>
            {c.links.map((x) => (
              <button key={x.id} onClick={() => onNavigate(x.id)} className="text-start hover:text-white w-fit min-h-11 sm:min-h-9">
                {x.l}
              </button>
            ))}
          </nav>
        ))}
        <div className="col-span-2 md:col-span-1 flex flex-wrap md:flex-col gap-x-6 text-sm">
          <p className="w-full font-semibold text-white text-base mb-1">{tx('كلمنا', 'Contact')}</p>
          <a href={`tel:${BRAND.hotline}`} className="flex items-center gap-2 hover:text-white min-h-11">
            <Phone className="w-4 h-4" /> {BRAND.hotline}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white min-h-11">
            <MessageCircle className="w-4 h-4" /> {tx('واتساب', 'WhatsApp')}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-wrap py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} {language === 'ar' ? BRAND.nameAr : BRAND.nameEn}. {tx('جميع الحقوق محفوظة', 'All rights reserved')}
          </p>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('terms')} className="hover:text-white min-h-11">{tx('الشروط والأحكام', 'Terms')}</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-white min-h-11">{tx('سياسة الخصوصية', 'Privacy')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
