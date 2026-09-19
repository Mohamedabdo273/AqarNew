import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RealEstateUnit, PropertyType, DeliveryStatus, FinishingType, UserInquiry } from '../types';
import { MOCK_UNITS } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface NewUnitInput {
  title?: string;
  developer: string;
  compound: string;
  region: 'القاهرة الجديدة' | 'الشيخ زايد وأكتوبر' | 'العاصمة الإدارية' | 'الساحل الشمالي' | 'المستقبل والشروق' | 'البحر الأحمر';
  propertyType: PropertyType;
  location?: string;
  areaM2: number;
  bedrooms?: number;
  bathrooms?: number;
  originalContractPrice: number;
  paidCashAmount: number;
  currentMarketPrice?: number;
  installmentValue?: number;
  installmentFrequency?: 'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي';
  installmentPeriodYears?: number;
  nextInstallmentDate?: string;
  deliveryDate?: string;
  deliveryStatus?: DeliveryStatus;
  finishing?: FinishingType;
  description?: string;
  ownerName?: string;
  ownerPhone?: string;
  uploadedFileName?: string;
}

export interface InquiryInput {
  unitId: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  preferredDate?: string;
  inquiryType?: 'viewing' | 'official_exit' | 'price_check';
}

interface UnitsContextType {
  units: RealEstateUnit[];
  savedUnitIds: string[];
  inquiries: (InquiryInput & { id: string; date: string; status: string; unitTitle: string })[];
  addUnit: (input: NewUnitInput) => RealEstateUnit;
  deleteUnit: (id: string) => void;
  toggleSaveUnit: (id: string) => void;
  isUnitSaved: (id: string) => boolean;
  submitInquiry: (input: InquiryInput) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

const STORAGE_KEY_UNITS = 'tanazul_units_data_v1';
const STORAGE_KEY_SAVED = 'tanazul_saved_units_v1';
const STORAGE_KEY_INQUIRIES = 'tanazul_inquiries_data_v1';

const DEFAULT_IMAGES_BY_TYPE: Record<string, string[]> = {
  'شقة': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  ],
  'تاون هاوس': [
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  ],
  'فيلا مستقلة': [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
  ],
  'دوبلكس': [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
  ],
  'شاليه ساحلي': [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ]
};

export const UnitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, addMyUnit, toggleSaveUnit: authToggleSave } = useAuth();

  // Load units
  const [units, setUnits] = useState<RealEstateUnit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load units from localStorage', e);
    }
    return MOCK_UNITS;
  });

  // Load saved bookmarks
  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return ['unit-1', 'unit-3'];
  });

  // Load inquiries
  const [inquiries, setInquiries] = useState<(InquiryInput & { id: string; date: string; status: string; unitTitle: string })[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load inquiries', e);
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UNITS, JSON.stringify(units));
    } catch (e) {
      console.error('Failed to persist units', e);
    }
  }, [units]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedUnitIds));
    } catch (e) {
      console.error('Failed to persist bookmarks', e);
    }
  }, [savedUnitIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to persist inquiries', e);
    }
  }, [inquiries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isUnitSaved = (id: string) => savedUnitIds.includes(id);

  const toggleSaveUnit = (id: string) => {
    setSavedUnitIds((prev) => {
      const exists = prev.includes(id);
      let updated: string[];
      if (exists) {
        updated = prev.filter((item) => item !== id);
        showToast('تمت إزالة الوحدة من المفضلة');
      } else {
        updated = [...prev, id];
        showToast('تم حفظ الوحدة في قائمتك المفضلة بنجاح ❤️');
      }
      return updated;
    });

    // Also sync with AuthContext if available
    try {
      authToggleSave(id);
    } catch (_) {}
  };

  const addUnit = (input: NewUnitInput): RealEstateUnit => {
    const remainingAmount = Math.max(0, input.originalContractPrice - input.paidCashAmount);
    
    // Estimate current developer price if not specified (~1.7x to 2x old contract price)
    const currentMarketPrice = input.currentMarketPrice || Math.round(input.originalContractPrice * 1.85);
    
    // Calculate default installment if not specified
    const years = input.installmentPeriodYears || 5;
    const installmentsCount = years * 4; // quarterly
    const installmentValue = input.installmentValue || Math.round(remainingAmount / Math.max(1, installmentsCount));

    const unitCode = `TNZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `unit-${Date.now()}`;

    const defaultImages = DEFAULT_IMAGES_BY_TYPE[input.propertyType] || DEFAULT_IMAGES_BY_TYPE['شقة'];

    const newUnit: RealEstateUnit = {
      id: newId,
      title: input.title || `${input.propertyType} ${input.areaM2}م² في ${input.compound || input.developer}`,
      titleEn: `${input.propertyType} ${input.areaM2} sqm in ${input.compound || input.developer}`,
      developer: input.developer,
      compound: input.compound || `${input.developer} Compound`,
      location: input.location || input.region,
      region: input.region,
      propertyType: input.propertyType,
      originalContractPrice: input.originalContractPrice,
      currentMarketPrice: currentMarketPrice,
      paidCashAmount: input.paidCashAmount,
      remainingAmount: remainingAmount,
      installmentPeriodYears: years,
      installmentFrequency: input.installmentFrequency || 'ربع سنوي',
      installmentValue: installmentValue,
      nextInstallmentDate: input.nextInstallmentDate || '2026-12-01',
      deliveryDate: input.deliveryDate || '2027-09-30',
      deliveryStatus: input.deliveryStatus || 'استلام 2027',
      areaM2: input.areaM2,
      bedrooms: input.bedrooms || 3,
      bathrooms: input.bathrooms || 2,
      floor: 'دور متوسط',
      finishing: input.finishing || 'نصف تشطيب',
      maintenanceFee: Math.round(input.originalContractPrice * 0.08),
      transferFeePolicy: 'معفي من رسوم التنازل',
      verifiedContract: true,
      verificationCode: unitCode,
      overpriceAmount: 0,
      images: defaultImages,
      features: [
        'معروضة بسعر العقد القديم',
        '0% أوفر برايس',
        'عقد مفحوص وقانوني 100%',
        'تسليم واسترداد شيكات في مقر المطور'
      ],
      description: input.description || `وحدة معروضة للتنازل الرسمي بدون أي أوفر برايس من المالك مباشرة. المدفوع المطلوب استرداده: ${input.paidCashAmount.toLocaleString()} ج.م، والمتبقي على أقساط مريحة.`,
      contractYear: 2023,
      viewsCount: 1,
      offersCount: 0,
      isHotDeal: true,
      urgencyBadge: 'معروضة حديثاً'
    };

    setUnits((prev) => [newUnit, ...prev]);

    // Also register in user's profile
    try {
      addMyUnit({
        title: newUnit.title,
        compound: newUnit.compound,
        developer: newUnit.developer,
        contractPrice: newUnit.originalContractPrice,
        paidAmount: newUnit.paidCashAmount
      });
    } catch (_) {}

    showToast('تم إدراج وحدتك بنجاح في منصة التنازل بدون أوفر برايس! 🚀');
    return newUnit;
  };

  const deleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    showToast('تم حذف الوحدة');
  };

  const submitInquiry = (input: InquiryInput) => {
    const targetUnit = units.find((u) => u.id === input.unitId);
    const newInquiry = {
      ...input,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'قيد التنسيق للمعاينة',
      unitTitle: targetUnit ? targetUnit.title : 'وحدة عقارية للتنازل'
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    showToast('تم استلام طلبك بنجاح! سيتواصل معك مستشار التنازل القانوني خلال ساعتين.');
  };

  return (
    <UnitsContext.Provider
      value={{
        units,
        savedUnitIds,
        inquiries,
        addUnit,
        deleteUnit,
        toggleSaveUnit,
        isUnitSaved,
        submitInquiry,
        toastMessage,
        showToast
      }}
    >
      {children}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[#0f172a] text-white text-xs sm:text-sm font-bold shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </UnitsContext.Provider>
  );
};

export const useUnits = (): UnitsContextType => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
};
