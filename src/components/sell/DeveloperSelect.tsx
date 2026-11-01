import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Check, Building2, ChevronDown, Sparkles, X, Plus, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { KnownDeveloper, useDeveloperCatalog } from '../../lib/developers';
import { RealEstateUnit } from '../../types';

interface DeveloperSelectProps {
  value: string;
  compoundValue: string;
  units?: RealEstateUnit[];
  onChange: (developer: string) => void;
  onCompoundChange: (compound: string) => void;
}

export const DeveloperSelect: React.FC<DeveloperSelectProps> = ({
  value,
  compoundValue,
  units = [],
  onChange,
  onCompoundChange,
}) => {
  const { language, tx } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsChanging(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Merge known developers with dynamic developers in units list
  const catalog = useDeveloperCatalog();
  const allDevelopers = useMemo(() => {
    const list = [...catalog];
    units.forEach((u) => {
      if (u.developer && !list.some((d) => d.nameAr === u.developer || d.nameEn === u.developer)) {
        list.push({
          id: `dyn-${u.developer}`,
          nameAr: u.developer,
          nameEn: u.developerEn || u.developer,
          popular: false,
          compounds: u.compound ? [{ ar: u.compound, en: u.compoundEn || u.compound }] : [],
        });
      }
    });
    return list;
  }, [catalog, units]);

  // Find currently selected developer object
  const currentDevObj = useMemo(() => {
    if (!value) return null;
    return allDevelopers.find((d) => d.nameAr === value || d.nameEn === value) || null;
  }, [value, allDevelopers]);

  // Filter developers according to search
  const filteredDevelopers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allDevelopers;
    return allDevelopers.filter(
      (d) =>
        d.nameAr.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.compounds.some((c) => c.ar.toLowerCase().includes(q) || c.en.toLowerCase().includes(q))
    );
  }, [allDevelopers, searchQuery]);

  const handleSelectDeveloper = (dev: KnownDeveloper) => {
    const chosenName = language === 'ar' ? dev.nameAr : (dev.nameEn || dev.nameAr);
    onChange(chosenName);
    setIsCustomMode(false);
    setIsChanging(false);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleStartChange = () => {
    setIsChanging(true);
    setIsCustomMode(false);
    setSearchQuery('');
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleClearSelection = () => {
    onChange('');
    setIsCustomMode(false);
    setIsChanging(false);
    setCustomName('');
    setSearchQuery('');
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSelectCustom = () => {
    setIsCustomMode(true);
    setIsChanging(false);
    setIsOpen(false);
    if (customName.trim()) {
      onChange(customName.trim());
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Label and Selected status */}
      <div className="flex items-center justify-between">
        <label className="label flex items-center gap-1.5 mb-0">
          <Building2 className="w-4 h-4 text-brand" />
          <span>{tx('المطور العقاري', 'Developer')}</span>
          <span className="text-danger">*</span>
        </label>

        {value && !isChanging && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-xs text-brand hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            {tx('مسح الاختيار', 'Clear selection')}
          </button>
        )}
      </div>

      {/* When a developer is chosen and not currently changing it */}
      {value && !isChanging && !isCustomMode ? (
        <div className="rounded-xl border-2 border-brand/40 bg-brand-soft/20 p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand text-white shrink-0">
              <Check className="w-4 h-4" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <div className="font-bold text-ink text-sm sm:text-base truncate">{value}</div>
              <div className="text-xs text-brand font-medium flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-brand" />
                <span>{tx('مطور عقاري معتمد في المنصة', 'Accredited developer')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStartChange}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-strong transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{tx('تغيير المطور', 'Change developer')}</span>
            </button>
          </div>
        </div>
      ) : isCustomMode ? (
        /* Custom developer manual input mode */
        <div className="rounded-xl border border-line bg-surface p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span>{tx('أدخل اسم شركة التطوير يدويًا:', 'Enter developer company name:')}</span>
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(false);
                setIsChanging(true);
                setIsOpen(true);
              }}
              className="text-brand hover:underline font-bold"
            >
              {tx('رجوع لقائمة المطورين', 'Back to list')}
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={customName || value}
              onChange={(e) => {
                setCustomName(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={tx('مثلاً: شركة العاصمة للتطوير العقاري', 'e.g. Capital Development Co.')}
              className="field flex-1 text-sm h-11"
            />
          </div>
        </div>
      ) : (
        /* Search and Filter Field (Active when selecting or changing) */
        <div className="relative">
          {isChanging && value && (
            <div className="mb-2 flex items-center justify-between text-xs text-ink-soft bg-paper px-3 py-1.5 rounded-lg border border-line">
              <span>{tx(`المطور الحالي: ${value}`, `Current: ${value}`)}</span>
              <button
                type="button"
                onClick={() => {
                  setIsChanging(false);
                  setIsOpen(false);
                }}
                className="text-brand hover:underline font-bold"
              >
                {tx('إلغاء', 'Cancel')}
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              placeholder={tx('دوّر على مطور (مثلاً: بالم هيلز، سوديك، إعمار، ماونتن فيو...)', 'Find developer (e.g. Palm Hills, SODIC, Emaar...)')}
              className="field h-12 text-sm ps-10 pe-10"
            />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={tx('فتح قائمة المطورين', 'Toggle developers list')}
              className="absolute top-1/2 -translate-y-1/2 end-2.5 grid place-items-center w-7 h-7 text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Dropdown list (matches filter style of first image) */}
          {isOpen && (
            <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-line bg-surface shadow-xl max-h-72 overflow-y-auto overflow-x-hidden p-2 space-y-1">
              <div className="px-2 py-1.5 text-xs text-muted font-bold flex items-center justify-between border-b border-line mb-1">
                <span>{tx('اختر المطور العقاري', 'Select Developer')}</span>
                <span className="num text-xs">{filteredDevelopers.length}</span>
              </div>

              {filteredDevelopers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-ink-soft mb-2">
                    {tx(`لم يتم العثور على مطور باسم "${searchQuery}"`, `No developer found matching "${searchQuery}"`)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomName(searchQuery);
                      onChange(searchQuery);
                      setIsCustomMode(true);
                      setIsChanging(false);
                      setIsOpen(false);
                    }}
                    className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {tx(`استخدام "${searchQuery}" كمطور جديد`, `Use "${searchQuery}" as custom developer`)}
                  </button>
                </div>
              ) : (
                filteredDevelopers.map((d) => {
                  const isSelected = value === d.nameAr || value === d.nameEn;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDeveloper(d)}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand text-white font-bold shadow-xs'
                          : 'hover:bg-paper text-ink hover:text-brand'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`grid place-items-center w-5 h-5 rounded-md border text-xs shrink-0 ${
                            isSelected
                              ? 'bg-white text-brand border-white'
                              : 'border-line text-transparent bg-surface'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm truncate">
                            {language === 'ar' ? d.nameAr : (d.nameEn || d.nameAr)}
                          </span>
                        </div>
                      </div>

                    </button>
                  );
                })
              )}

              {/* Always provide custom developer button at the bottom */}
              <div className="pt-1.5 mt-1 border-t border-line">
                <button
                  type="button"
                  onClick={handleSelectCustom}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-start text-xs font-bold text-brand hover:bg-brand-soft/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{tx('المطور غير موجود بالقائمة؟ اكتب اسمه يدوياً', 'Developer not listed? Type manually')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggested Compounds row if the chosen developer has known compounds */}
      {currentDevObj && currentDevObj.compounds.length > 0 && (
        <div className="rounded-xl border border-line bg-surface/80 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              {tx(
                `كمبوندات شائعة لـ (${language === 'ar' ? currentDevObj.nameAr.split('(')[0].trim() : currentDevObj.nameEn.split('(')[0].trim()}):`,
                `Popular compounds for ${currentDevObj.nameEn.split('(')[0].trim()}:`
              )}
            </span>
            <span className="text-[11px] text-muted">{tx('اضغط للاختيار السريع', 'Click to auto-fill')}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentDevObj.compounds.map((c) => {
              const cName = language === 'ar' ? c.ar : (c.en || c.ar);
              const isCompSelected = compoundValue === c.ar || compoundValue === c.en;
              return (
                <button
                  key={c.ar}
                  type="button"
                  onClick={() => onCompoundChange(cName)}
                  className={`text-xs py-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                    isCompSelected
                      ? 'bg-brand text-white border-brand font-bold'
                      : 'bg-paper text-ink border-line hover:border-brand hover:text-brand'
                  }`}
                >
                  {cName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
