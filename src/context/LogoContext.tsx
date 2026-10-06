import React, { createContext, useContext, useEffect, useState } from 'react';

export type LogoVariant = 'wordmark' | 'portal' | 'crest' | 'dot' | 'skyline';

export interface LogoOption {
  id: LogoVariant;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badge: string;
}

export const LOGO_OPTIONS: LogoOption[] = [
  {
    id: 'wordmark',
    nameAr: 'النمط الطباعي الحديث (Modern Wordmark)',
    nameEn: 'Modern Typographic Wordmark',
    descriptionAr: 'تصميم نقي وعصري يركز على اسم FORSA بالإنجليزية كعنصر رئيسي بخط هندسي عريض، مع كلمة "فرصة" بالعربية تحته بمسافات متناسقة.',
    descriptionEn: 'Pure and modern typography with bold FORSA in English on top, accompanied by styled Arabic underneath.',
    badge: 'كلاسيكي وعصري',
  },
  {
    id: 'portal',
    nameAr: 'أيقونة البوابة العقارية (Gateway Portal)',
    nameEn: 'Architectural Gateway Portal',
    descriptionAr: 'رمز هندسي يمثل بوابة مفتوحة وفرصة خروج آمنة من الأقساط، مع كلمة FORSA الإنجليزية بالأعلى وفرصة بالعربية بالأسفل.',
    descriptionEn: 'Architectural emblem representing an open gateway / safe exit, paired with bold FORSA above Arabic.',
    badge: 'الأكثر تميزاً',
  },
  {
    id: 'crest',
    nameAr: 'شارة المونوغرام المؤسسي (Financial Crest)',
    nameEn: 'Institutional Crest',
    descriptionAr: 'أيقونة درع عصري بحرف F مدمج مع سقف هندسي يعكس الثقة والموثوقية المالية والقانونية، بجانبه FORSA بالإنجليزية وفرصة بالعربية.',
    descriptionEn: 'Modern monogram crest with geometric F, conveying financial and legal trust, paired with dual-script branding.',
    badge: 'طابع مؤسسي وقانوني',
  },
  {
    id: 'dot',
    nameAr: 'نمط التكنولوجيا المالية (Fintech Dot)',
    nameEn: 'Fintech Dot Style',
    descriptionAr: 'خط عريض جريء مع نقطة برتقالية دائرية تمثل اتخاذ القرار، مع كلمة "فرصة" محاطة بخطين خفيفين للإبراز.',
    descriptionEn: 'Bold tech-forward lockup with accent terracotta dot, and framed Arabic script.',
    badge: 'جريء ومباشر',
  },
  {
    id: 'skyline',
    nameAr: 'الأفق المعماري (Skyline Angle)',
    nameEn: 'Architectural Skyline',
    descriptionAr: 'أيقونة أبراج معمارية متدرجة ترمز إلى الفرص العقارية والاستثمارية القوية، مع اسم FORSA الإنجليزي في الصدارة وفرصة تحته.',
    descriptionEn: 'Stepped architectural towers emblem symbolizing real estate growth, with English FORSA leading.',
    badge: 'عقاري استثماري',
  },
];

interface LogoContextType {
  logoVariant: LogoVariant;
  setLogoVariant: (variant: LogoVariant) => void;
  isPickerOpen: boolean;
  setIsPickerOpen: (open: boolean) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

const STORAGE_KEY = 'forsa_selected_logo_variant_v1';

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoVariant, setLogoVariantState] = useState<LogoVariant>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LOGO_OPTIONS.some((o) => o.id === saved)) {
        return saved as LogoVariant;
      }
    } catch {
      // ignore
    }
    return 'portal'; // Default to the Gateway Portal with English on top
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const setLogoVariant = (variant: LogoVariant) => {
    setLogoVariantState(variant);
    try {
      localStorage.setItem(STORAGE_KEY, variant);
    } catch {
      // ignore
    }
  };

  return (
    <LogoContext.Provider
      value={{
        logoVariant,
        setLogoVariant,
        isPickerOpen,
        setIsPickerOpen,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};
