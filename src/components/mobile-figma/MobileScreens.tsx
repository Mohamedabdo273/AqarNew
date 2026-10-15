import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  Tag,
  Repeat,
  User,
  Heart,
  Scale,
  MessageCircle,
  Phone,
  ShieldCheck,
  Building2,
  ChevronRight,
  ChevronLeft,
  Filter,
  Check,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Maximize2,
  Bed,
  Bath,
  Share2,
  X,
  Plus,
  Clock,
  ArrowUpRight,
  BadgePercent,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { KNOWN_DEVELOPERS, KnownDeveloper } from '../../lib/developers';
import { RealEstateUnit } from '../../types';

export type ScreenId = 'home' | 'listings' | 'detail' | 'sell' | 'swap' | 'account';

interface MobileScreensProps {
  screen: ScreenId;
  platform: 'ios' | 'android';
  onNavigateScreen: (screen: ScreenId) => void;
  units?: RealEstateUnit[];
}

export const MobileScreens: React.FC<MobileScreensProps> = ({
  screen,
  platform,
  onNavigateScreen,
  units = [],
}) => {
  // Sample featured unit
  const sampleUnit: RealEstateUnit = units[0] || {
    id: 'unit-1',
    title: 'شقة فاخرة بحري بإطلالة بحيرات في بالم هيلز التجمع',
    titleEn: 'Luxury Apartment with Lake View in Palm Hills New Cairo',
    developer: 'بالم هيلز للتعمير (Palm Hills)',
    compound: 'كمبوند بالم هيلز نيو كايرو',
    location: 'التجمع الخامس، القاهرة الجديدة',
    subArea: 'التجمع الخامس',
    region: 'قاهرة',
    propertyType: 'شقة',
    originalContractPrice: 4600000,
    currentMarketPrice: 8900000,
    paidCashAmount: 1850000,
    remainingAmount: 2750000,
    installmentPeriodYears: 5,
    installmentFrequency: 'ربع سنوي',
    installmentValue: 137500,
    nextInstallmentDate: '2026-11-15',
    deliveryDate: '2027-06-30',
    deliveryStatus: 'استلام 2027',
    areaM2: 175,
    bedrooms: 3,
    bathrooms: 3,
    floor: 'الدور الثالث (أسانسير)',
    finishing: 'نصف تشطيب',
    maintenanceFee: 230000,
    transferFeePolicy: 'معفي من رسوم التنازل',
    verifiedContract: true,
    verificationCode: 'WHD-8902',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=75',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75',
    ],
    description: 'شقة بحري صريح غير مجروحة بأميز مراحل بالم هيلز.',
    featuredDeal: true,
  };

  /* -------------------------------------------------------------
     SCREEN 1: HOME (الرئيسية)
  ------------------------------------------------------------- */
  if (screen === 'home') {
    return (
      <div className="pb-20 text-ink text-start">
        {/* Mobile App Header */}
        <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md px-4 py-3 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-base shadow-sm">
              ف
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-ink">فُـرصـة</span>
              <span className="text-[10px] text-muted block -mt-1">منصة التنازل العقاري المعتمد</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateScreen('account')}
              className="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-muted"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Search Box (iOS / Android styled) */}
        <div className="p-4">
          <div className="bg-brand text-white rounded-2xl p-4 shadow-lift relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-accent/20 blur-xl pointer-events-none" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>0% أوفر برايس · بسعر العقد القديم</span>
            </div>
            <h1 className="text-xl font-bold leading-tight mb-1 text-white">
              اشتري أو بيع شقتك بدون خسارة
            </h1>
            <p className="text-xs text-white/80 mb-3">
              استرد كاشك لو مش قادر تكمل الأقساط — فحص قانوني معتمد 100%
            </p>

            {/* Mobile Search Input */}
            <div
              onClick={() => onNavigateScreen('listings')}
              className="bg-white text-ink rounded-xl p-2.5 flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <Search className="w-4 h-4 text-brand" />
                <span>دوّر بالمطور أو الكمبوند أو المنطقة...</span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-sand-soft text-brand text-[11px] font-bold">
                فلترة
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="px-4 grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={() => onNavigateScreen('listings')}
            className="p-3 rounded-xl bg-surface border border-line flex flex-col items-center justify-center text-center shadow-soft hover:border-brand/40 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center mb-1.5">
              <Search className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">اشتري كاش</span>
            <span className="text-[10px] text-muted">وفرت الأوفر</span>
          </button>

          <button
            onClick={() => onNavigateScreen('sell')}
            className="p-3 rounded-xl bg-surface border border-line flex flex-col items-center justify-center text-center shadow-soft hover:border-accent/40 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-accent-soft text-accent flex items-center justify-center mb-1.5">
              <Tag className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-accent">اعرض وحدتك</span>
            <span className="text-[10px] text-muted">استرد كاشك</span>
          </button>

          <button
            onClick={() => onNavigateScreen('swap')}
            className="p-3 rounded-xl bg-surface border border-line flex flex-col items-center justify-center text-center shadow-soft hover:border-brand/40 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs">بدّل وحدتك</span>
            <span className="text-[10px] text-muted">قسط أقل</span>
          </button>
        </div>

        {/* Top Accredited Developers Reel */}
        <div className="mb-5">
          <div className="px-4 flex items-center justify-between mb-2">
            <span className="font-bold text-sm">المطورين المعتمدين</span>
            <button
              onClick={() => onNavigateScreen('listings')}
              className="text-xs text-brand font-semibold flex items-center gap-0.5"
            >
              <span>الكل</span>
              <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
            </button>
          </div>
          <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-1">
            {KNOWN_DEVELOPERS.slice(0, 6).map((dev) => (
              <button
                key={dev.id}
                onClick={() => onNavigateScreen('listings')}
                className="shrink-0 px-3 py-2 rounded-xl bg-surface border border-line flex items-center gap-2 shadow-soft hover:border-brand text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-md bg-sand-soft text-brand-ink flex items-center justify-center font-bold text-[10px]">
                  {dev.nameAr.charAt(0)}
                </div>
                <span>{dev.nameAr.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Opportunities Section */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <span className="font-bold text-sm block">فرص حصرية معتمدة</span>
              <span className="text-[11px] text-muted">عقود مفحوصة قانونياً · 0 أوفر</span>
            </div>
            <button
              onClick={() => onNavigateScreen('listings')}
              className="text-xs text-accent font-semibold"
            >
              عرض الكل (12)
            </button>
          </div>

          {/* Unit Card Preview */}
          <div
            onClick={() => onNavigateScreen('detail')}
            className="rounded-2xl bg-surface border border-line overflow-hidden shadow-soft cursor-pointer hover:shadow-lift transition-all"
          >
            <div className="relative aspect-[16/10] bg-ink/10">
              <img
                src={sampleUnit.images[0]}
                alt={sampleUnit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 start-2.5 bg-accent text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm">
                سعر العقد القديم · 0 أوفر
              </div>
              <button className="absolute top-2.5 end-2.5 w-7 h-7 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 start-2.5 end-2.5 bg-ink/80 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[11px]">
                <span>بالم هيلز · التجمع</span>
                <span className="text-emerald-400 font-bold">فحص معتمد 100%</span>
              </div>
            </div>

            <div className="p-3.5">
              <h2 className="font-bold text-sm leading-snug line-clamp-1 mb-2">
                {sampleUnit.title}
              </h2>

              <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-field border border-line text-xs mb-3">
                <div>
                  <span className="text-[10px] text-muted block">المطلوب كاش:</span>
                  <span className="font-bold text-accent text-sm">
                    {sampleUnit.paidCashAmount.toLocaleString()} ج.م
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">القسط الربع سنوي:</span>
                  <span className="font-bold text-ink text-sm">
                    {sampleUnit.installmentValue?.toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-line">
                <span>175 م² · 3 غرف · دور 3</span>
                <span className="text-brand font-semibold flex items-center gap-0.5">
                  التفاصيل
                  <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Trust Banner */}
        <div className="px-4 mb-4">
          <div className="p-3 rounded-xl bg-sand-soft border border-sand flex items-center gap-3 text-xs">
            <ShieldCheck className="w-6 h-6 text-brand shrink-0" />
            <div>
              <span className="font-bold text-brand block">ضمان التنازل الرسمي في مقر المطور</span>
              <span className="text-muted text-[11px]">لا يتم دفع الكاش إلا بعد صدور إشعار نقل الملكية المعتمد</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     SCREEN 2: LISTINGS & FILTER PANEL (فرص السوق)
  ------------------------------------------------------------- */
  if (screen === 'listings') {
    return (
      <div className="pb-20 text-ink text-start">
        {/* Search & Filter Header */}
        <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md px-4 py-3 border-b border-line space-y-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateScreen('home')}
              className="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-muted shrink-0"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ابحث بالمطور، الكمبوند، المنطقة..."
                defaultValue="بالم هيلز"
                className="w-full bg-surface border border-field-border rounded-xl px-9 py-2 text-xs font-medium focus:outline-none focus:border-brand"
              />
              <Search className="w-4 h-4 text-muted absolute start-3 top-2.5" />
            </div>
            <button className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Active Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-brand text-white font-semibold shrink-0">
              بالم هيلز ✕
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-muted shrink-0">
              القاهرة الجديدة
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-muted shrink-0">
              أقل من 2 مليون كاش
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface border border-line text-muted shrink-0">
              شقق
            </span>
          </div>
        </div>

        {/* Results Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between text-xs text-muted border-b border-line bg-paper">
          <span>
            عرض <strong className="text-ink">8 وحدات معتمدة</strong>
          </span>
          <span className="flex items-center gap-1 text-brand font-semibold">
            الأعلى وفراً
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Listings Cards Feed */}
        <div className="p-4 space-y-3.5">
          {/* Card 1 */}
          <div
            onClick={() => onNavigateScreen('detail')}
            className="rounded-2xl bg-surface border border-line overflow-hidden shadow-soft cursor-pointer hover:border-brand/40 transition-all"
          >
            <div className="relative aspect-[16/9] bg-ink/10">
              <img
                src={sampleUnit.images[0]}
                alt={sampleUnit.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 start-2 bg-accent text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                0 جنيه أوفر برايس
              </div>
              <button className="absolute top-2 end-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-2 start-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px]">
                بالم هيلز نيو كايرو
              </div>
            </div>

            <div className="p-3">
              <h3 className="font-bold text-xs leading-snug line-clamp-1 mb-1.5">
                شقة 175م² بحري في بالم هيلز التجمع
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted mb-2">
                <span>3 غرف</span>
                <span>·</span>
                <span>3 حمام</span>
                <span>·</span>
                <span>استلام 2027</span>
              </div>

              <div className="p-2 rounded-xl bg-field flex items-center justify-between text-xs mb-2.5">
                <div>
                  <span className="text-[10px] text-muted block">المطلوب كاش:</span>
                  <span className="font-bold text-accent text-sm">1,850,000 ج.م</span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-muted block">وفر الأوفر برايس:</span>
                  <span className="font-bold text-emerald-700 text-xs">+4.3 مليون ج.م</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('تم نسخ رابط الوحدة والمقارنة');
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-surface border border-line text-xs font-semibold text-ink flex items-center justify-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5 text-muted" />
                  <span>قارن</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://wa.me/201000000000', '_blank');
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigateScreen('detail')}
            className="rounded-2xl bg-surface border border-line overflow-hidden shadow-soft cursor-pointer hover:border-brand/40 transition-all"
          >
            <div className="relative aspect-[16/9] bg-ink/10">
              <img
                src={sampleUnit.images[1]}
                alt="SODIC Villette"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 start-2 bg-brand text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                سوديك فيليت · التجمع
              </div>
              <button className="absolute top-2 end-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3">
              <h3 className="font-bold text-xs leading-snug line-clamp-1 mb-1.5">
                تاون هاوس كورنر 210م² سوديك فيليت
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted mb-2">
                <span>4 غرف</span>
                <span>·</span>
                <span>حديقة خاصة</span>
                <span>·</span>
                <span>استلام فوري</span>
              </div>

              <div className="p-2 rounded-xl bg-field flex items-center justify-between text-xs mb-2.5">
                <div>
                  <span className="text-[10px] text-muted block">المطلوب كاش:</span>
                  <span className="font-bold text-accent text-sm">3,400,000 ج.م</span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-muted block">المتبقي أقساط:</span>
                  <span className="font-bold text-ink text-xs">4,100,000 ج.م</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-surface border border-line text-xs font-semibold text-ink flex items-center justify-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5 text-muted" />
                  <span>قارن</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     SCREEN 3: UNIT DETAIL (تفاصيل الوحدة)
  ------------------------------------------------------------- */
  if (screen === 'detail') {
    return (
      <div className="pb-24 text-ink text-start">
        {/* Full Bleed Image Gallery with Back button */}
        <div className="relative aspect-[4/3] bg-ink/10">
          <img
            src={sampleUnit.images[0]}
            alt={sampleUnit.title}
            className="w-full h-full object-cover"
          />
          {/* Top navigation overlay */}
          <div className="absolute top-3 start-3 end-3 flex items-center justify-between z-10">
            <button
              onClick={() => onNavigateScreen('listings')}
              className="w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-3 end-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-sm">
            1 / 6 صور
          </div>
          <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-md bg-accent text-white text-xs font-bold shadow-sm">
            0% أوفر برايس
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
              <Building2 className="w-3.5 h-3.5 text-brand" />
              <span>{sampleUnit.developer}</span>
              <span>·</span>
              <span>{sampleUnit.compound}</span>
            </div>
            <h1 className="text-base font-bold leading-snug">{sampleUnit.title}</h1>
            <div className="flex items-center gap-1 text-xs text-muted mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{sampleUnit.location}</span>
            </div>
          </div>

          {/* Legal Audit Passport */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-800 block">فحص قانوني معتمد 100%</span>
              <span className="text-emerald-700 text-[11px]">
                تم التحقق من العقد الأصلي وسجل سداد الأقساط لدى المطور
              </span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="p-3.5 rounded-2xl bg-surface border border-line shadow-soft space-y-2.5 text-xs">
            <span className="font-bold text-sm block">تفاصيل السداد والفرصة المالية</span>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">المطلوب كاش للبائع:</span>
                <strong className="text-accent text-sm font-bold">
                  {sampleUnit.paidCashAmount.toLocaleString()} ج.م
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">باقي الأقساط للمطور:</span>
                <strong>{sampleUnit.remainingAmount.toLocaleString()} ج.م</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">القسط الربع سنوي:</span>
                <strong>{sampleUnit.installmentValue?.toLocaleString()} ج.م</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted">سنوات التقسيط المتبقية:</span>
                <strong>5 سنوات (حتى 2031)</strong>
              </div>
              <div className="flex justify-between py-1 bg-accent-soft px-2 rounded-lg text-accent-ink">
                <span>وفر الأوفر برايس:</span>
                <strong>0 جنيه أوفر برايس</strong>
              </div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-field border border-line">
              <Maximize2 className="w-4 h-4 text-muted mx-auto mb-1" />
              <span className="text-[10px] text-muted block">المساحة</span>
              <strong>175 م²</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-field border border-line">
              <Bed className="w-4 h-4 text-muted mx-auto mb-1" />
              <span className="text-[10px] text-muted block">الغرف</span>
              <strong>3 غرف نوم</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-field border border-line">
              <Calendar className="w-4 h-4 text-muted mx-auto mb-1" />
              <span className="text-[10px] text-muted block">الاستلام</span>
              <strong>يونيو 2027</strong>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Floating Actions */}
        <div className="fixed bottom-7 start-0 end-0 bg-surface/95 backdrop-blur-md border-t border-line p-3 flex items-center gap-2 z-30">
          <button
            onClick={() => alert('جاري الاتصال بخدمة عملاء فرصة')}
            className="w-11 h-11 rounded-xl bg-field border border-line flex items-center justify-center text-ink shrink-0"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open('https://wa.me/201000000000', '_blank')}
            className="flex-1 min-h-11 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lift"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل واتساب مع المسؤول</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     SCREEN 4: SELL YOUR UNIT (اعرض وحدتك)
  ------------------------------------------------------------- */
  if (screen === 'sell') {
    return (
      <div className="pb-20 text-ink text-start">
        {/* Step Indicator Header */}
        <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md px-4 py-3 border-b border-line">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">اعرض وحدتك واسترد كاشك</span>
            <span className="text-xs text-accent font-semibold">خطوة 2 من 4</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-line overflow-hidden">
            <div className="w-1/2 h-full bg-accent rounded-full transition-all" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 rounded-xl bg-brand-soft border border-brand/20 text-xs text-brand-ink">
            <strong>نظام التنازل الذكي:</strong> بنراجع عقدك الأصلي وبنوفرلك مشتري كاش جاد
            خلال 3 إلى 7 أيام بدون أوفر برايس وبدون عمولة مبالغ فيها.
          </div>

          {/* Form Fields: Developer Filter Focus */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                المطور العقاري <span className="text-danger">*</span>
              </label>
              {/* Searchable Combobox Matching SellUnitPage */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن المطور (مثال: بالم هيلز، سوديك، إعمار...)"
                  defaultValue="بالم هيلز للتعمير (Palm Hills)"
                  className="w-full bg-surface border border-field-border rounded-xl px-9 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand"
                />
                <Search className="w-4 h-4 text-muted absolute start-3 top-3" />
                <button className="absolute end-3 top-2.5 text-xs text-accent font-bold">
                  تغيير
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                اسم الكمبوند أو المشروع <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: بالم هيلز نيو كايرو"
                defaultValue="كمبوند بالم هيلز نيو كايرو"
                className="w-full bg-surface border border-field-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  سعر العقد الأصلي <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="4,600,000"
                  className="w-full bg-surface border border-field-border rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  المدفوع كاش المطلوب <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="1,850,000"
                  className="w-full bg-surface border border-field-border rounded-xl px-3 py-2 text-xs font-semibold text-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                هل عليك متأخرات أقساط؟
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button className="py-2 rounded-xl bg-brand text-white font-bold">
                  لا، منتظم في السداد
                </button>
                <button className="py-2 rounded-xl bg-surface border border-line text-muted">
                  نعم، وتُخصم من الكاش
                </button>
              </div>
            </div>

            <button
              onClick={() => alert('تم حفظ مسودة الوحدة!')}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold text-xs shadow-lift hover:bg-accent-ink transition-all mt-3"
            >
              متابعة إلى خطوة الصور والعقد
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     SCREEN 5: SWAP (البدل العقاري)
  ------------------------------------------------------------- */
  if (screen === 'swap') {
    return (
      <div className="pb-20 text-ink text-start">
        <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md px-4 py-3 border-b border-line flex items-center justify-between">
          <span className="font-bold text-sm">البدل العقاري الذكي</span>
          <span className="text-xs text-brand font-semibold">توفيق مباشر</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-brand text-white shadow-lift space-y-2">
            <span className="text-xs text-white/80 block">بديل البيع التقليدي:</span>
            <h2 className="text-base font-bold text-white">
              بدّل وحدتك بوحدة تانية بقسط أقل أو موقع مختلف
            </h2>
            <p className="text-xs text-white/70">
              بدون عمولة مضاعفة ومع ضمان تنفيذ التنازلين في نفس اليوم لدى المطورين.
            </p>
          </div>

          {/* Swap Match Sample Card */}
          <div className="p-3.5 rounded-2xl bg-surface border border-line shadow-soft space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold">
                تطابق 98%
              </span>
              <span className="text-muted">مشتري جاهز للبدل</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-field border border-line">
                <span className="text-[10px] text-muted block">معروض للبدل:</span>
                <strong className="text-ink">شقة 160م² في زايد</strong>
                <span className="text-[10px] text-muted block mt-0.5">سوديك كرميل</span>
              </div>
              <div className="p-2 rounded-xl bg-field border border-line">
                <span className="text-[10px] text-muted block">مطلوب بدلها:</span>
                <strong className="text-brand">شقة أو بنتهاوس</strong>
                <span className="text-[10px] text-muted block mt-0.5">في التجمع الخامس</span>
              </div>
            </div>

            <button
              onClick={() => alert('تم تسجيل اهتمامك بهذا البدل')}
              className="w-full py-2.5 rounded-xl bg-brand text-white text-xs font-bold"
            >
              اطلب مقابلة توفيق البدل
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     SCREEN 6: ACCOUNT & SIGN IN (حسابي)
  ------------------------------------------------------------- */
  return (
    <div className="pb-20 text-ink text-start">
      <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md px-4 py-3 border-b border-line flex items-center justify-between">
        <span className="font-bold text-sm">حسابي وتسجيل الدخول</span>
        <span className="text-xs text-muted">فرصة</span>
      </div>

      <div className="p-4 space-y-4">
        {/* OTP Login Preview */}
        <div className="p-4 rounded-2xl bg-surface border border-line shadow-soft space-y-3">
          <span className="font-bold text-sm block">تسجيل الدخول السريع</span>
          <p className="text-xs text-muted">
            أدخل رقم موبايلك المصري لتتبع طلباتك أو متابعة الوحدات المحفوظة:
          </p>

          <div className="flex items-center gap-2">
            <span className="px-3 py-2 rounded-xl bg-field border border-line text-xs font-bold text-ink">
              +20
            </span>
            <input
              type="tel"
              placeholder="010XXXXXXXX"
              defaultValue="01012345678"
              className="flex-1 bg-surface border border-field-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand"
            />
          </div>

          <button
            onClick={() => alert('تم إرسال كود التحقق في رسالة نصية')}
            className="w-full py-2.5 rounded-xl bg-brand text-white text-xs font-bold shadow-soft"
          >
            إرسال كود الدخول السريع (OTP)
          </button>
        </div>

        {/* User Status / Requests tracker preview */}
        <div className="p-3.5 rounded-2xl bg-surface border border-line shadow-soft space-y-2.5 text-xs">
          <span className="font-bold text-xs block text-ink">متابعة طلبات التنازل الخاصة بك</span>
          <div className="p-2.5 rounded-xl bg-field border border-line flex items-center justify-between">
            <div>
              <span className="font-bold text-ink block">طلب تنازل #WHD-8902</span>
              <span className="text-[10px] text-muted">شقة بالم هيلز التجمع</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
              قيد المراجعة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   NATIVE BOTTOM TAB BAR (iOS SF-style & Android Material 3)
------------------------------------------------------------- */
interface MobileTabBarProps {
  platform: 'ios' | 'android';
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  platform,
  activeScreen,
  onNavigate,
}) => {
  const tabs: { id: ScreenId; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'listings', label: 'اشتري', icon: Search },
    { id: 'sell', label: 'بيع', icon: Tag },
    { id: 'swap', label: 'بدّل', icon: Repeat },
    { id: 'account', label: 'حسابي', icon: User },
  ];

  if (platform === 'ios') {
    return (
      <div className="h-[52px] bg-surface/90 backdrop-blur-xl border-t border-line flex items-center justify-around px-2 select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-[#007aff]' : 'text-[#8e8e93] hover:text-ink'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5 stroke-[2.2]" />
              <span className="text-[10px] font-semibold leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Android Material 3 Navigation Bar
  return (
    <div className="h-[58px] bg-surface/95 backdrop-blur-md border-t border-line flex items-center justify-around px-2 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
          >
            <div
              className={`px-3 py-1 rounded-full flex items-center justify-center mb-0.5 transition-all ${
                isActive ? 'bg-brand text-white shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span
              className={`text-[10px] font-medium leading-none ${
                isActive ? 'font-bold text-brand' : 'text-muted'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
