import React, { useState } from 'react';
import { Copy, Check, Palette, Type, Smartphone, Layers, Download, Code, Sparkles } from 'lucide-react';

export const DesignSystemTokens: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const colors = [
    { name: 'Brand Navy (الأساسي)', hex: '#1e3a5f', rgb: 'rgb(30, 58, 95)', desc: 'أزرار رئيسية، هيدر، شريط التنقل' },
    { name: 'Accent Brick Red (طوبي/أحمر هادئ)', hex: '#b5562f', rgb: 'rgb(181, 86, 47)', desc: 'بادج 0 أوفر، فرص حصرية، إجراءات البائع' },
    { name: 'Accent Orange (برتقالي الشعار)', hex: '#f26a0a', rgb: 'rgb(242, 106, 10)', desc: 'أيقونة الشعار ولمسات التمييز' },
    { name: 'Paper Background (خلفية ورقية)', hex: '#f7f5ef', rgb: 'rgb(247, 245, 239)', desc: 'الخلفية العامة للتطبيق لراحة العين' },
    { name: 'Surface White (أبيض الكروت)', hex: '#ffffff', rgb: 'rgb(255, 255, 255)', desc: 'كروت الوحدات، القوائم المنبثقة' },
    { name: 'Ink Black (نص داكن)', hex: '#121210', rgb: 'rgb(18, 18, 16)', desc: 'النصوص والعناوين الرئيسية' },
    { name: 'Muted Gray (نص ثانوي)', hex: '#595852', rgb: 'rgb(89, 88, 82)', desc: 'التفاصيل الثانوية والأوصاف' },
    { name: 'Border Line (الحدود والفواصل)', hex: '#e7e5df', rgb: 'rgb(231, 229, 223)', desc: 'خطوط التقسيم والحدود الرفيعة' },
    { name: 'Verified Emerald (أخضر الفحص)', hex: '#059669', rgb: 'rgb(5, 150, 105)', desc: 'بادج الفحص القانوني المعتمد' },
  ];

  const typography = [
    { role: 'Display (العناوين الكبرى)', ar: 'IBM Plex Sans Arabic', size: '22px / 1.3', weight: '700 (Bold)', sample: 'اشتري أو بيع شقتك بدون خسارة' },
    { role: 'Headline (عناوين الكروت)', ar: 'IBM Plex Sans Arabic', size: '16px / 1.4', weight: '700 (Bold)', sample: 'شقة فاخرة بحري بإطلالة بحيرات في بالم هيلز' },
    { role: 'Body (النصوص العامة)', ar: 'IBM Plex Sans Arabic', size: '14px / 1.6', weight: '500 (Medium)', sample: 'استرد كاشك لو مش قادر تكمل الأقساط — فحص قانوني معتمد 100%' },
    { role: 'Caption & Meta (الأرقام والميتا)', ar: 'Plus Jakarta Sans + Arabic', size: '12px / 1.4', weight: '600 (SemiBold)', sample: '1,850,000 EGP · 175 m² · 3 Beds' },
    { role: 'Brand Typography (شعار DEAL)', ar: 'Arial / Display', size: '24px', weight: '700 (Bold)', sample: 'DEAL' },
  ];

  const figmaJson = JSON.stringify(
    {
      designSystem: 'DEAL Real Estate Mobile DS',
      version: '2.4.0',
      platforms: ['iOS 18 (SF Pro + IBM Plex Arabic)', 'Android 15 (Material 3)'],
      colorTokens: colors,
      grid: '8pt baseline grid',
      touchTargets: {
        ios: '44pt minimum',
        android: '48dp minimum',
      },
      elevation: {
        soft: '0 1px 2px rgba(18, 18, 16, 0.04)',
        lift: '0 2px 4px rgba(18, 18, 16, 0.04), 0 20px 40px -20px rgba(18, 18, 16, 0.25)',
      },
    },
    null,
    2
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-start">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Palette className="w-5 h-5 text-brand" />
            <span>توكنز التصميم ومواصفات Figma (Design System Tokens)</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            مواصفات الألوان، الخطوط، الشبكة الهندسية، والفروق بين نظامي iOS و Android
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(figmaJson, 'all-json')}
          className="btn-ghost min-h-10 px-4 text-xs font-bold flex items-center gap-2"
        >
          {copiedKey === 'all-json' ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم نسخ JSON!</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4 text-brand" />
              <span>نسخ مواصفات Figma JSON</span>
            </>
          )}
        </button>
      </div>

      {/* Colors Grid */}
      <section className="space-y-3">
        <h3 className="font-bold text-sm text-ink flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" />
          <span>لوحة الألوان المعتمدة (Color Palette)</span>
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colors.map((c, i) => (
            <div
              key={i}
              onClick={() => copyToClipboard(c.hex, `color-${i}`)}
              className="p-3 rounded-2xl bg-surface border border-line flex items-center gap-3 cursor-pointer hover:border-brand/40 shadow-soft transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl border border-black/10 shrink-0 shadow-sm flex items-center justify-center text-white"
                style={{ backgroundColor: c.hex }}
              >
                {copiedKey === `color-${i}` && <Check className="w-5 h-5 drop-shadow" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate group-hover:text-brand">{c.name}</div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-muted mt-0.5">
                  <span>{c.hex}</span>
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[10px] text-muted truncate mt-0.5">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-3">
        <h3 className="font-bold text-sm text-ink flex items-center gap-2">
          <Type className="w-4 h-4 text-brand" />
          <span>مقياس الخطوط والتايبوغرافي (Typography Scale)</span>
        </h3>
        <div className="rounded-2xl bg-surface border border-line divide-y divide-line overflow-hidden shadow-soft">
          {typography.map((t, idx) => (
            <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="w-48 shrink-0">
                <span className="font-bold text-xs block text-ink">{t.role}</span>
                <span className="text-[11px] text-muted">{t.size} · {t.weight}</span>
              </div>
              <div className="flex-1 text-sm font-semibold text-ink" style={{ fontFamily: t.ar.includes('Messiri') ? "'El Messiri', serif" : 'inherit' }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* iOS vs Android HIG Matrix */}
      <section className="space-y-3">
        <h3 className="font-bold text-sm text-ink flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>مقارنة معايير iOS Human Interface Guidelines و Android Material 3</span>
        </h3>
        <div className="rounded-2xl bg-surface border border-line overflow-hidden shadow-soft text-xs">
          <div className="grid grid-cols-3 bg-field p-3 font-bold border-b border-line">
            <span>العنصر الهندسي</span>
            <span className="text-brand">Apple iOS 18 (iPhone 16 Pro)</span>
            <span className="text-emerald-700">Google Android 15 (Material 3)</span>
          </div>

          <div className="divide-y divide-line">
            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">حجم شاشة التصميم</span>
              <span>393 × 852 pt (Super Retina XDR)</span>
              <span>412 × 915 dp (AMOLED 120Hz)</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">الحد الأدنى لمساحة اللمس</span>
              <span className="font-bold text-brand">44 × 44 pt</span>
              <span className="font-bold text-emerald-700">48 × 48 dp</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">شريط الحالة (Status Bar)</span>
              <span>47 pt (مع الجزيرة التفاعلية Dynamic Island)</span>
              <span>24–36 dp (مع ثقب الكاميرا Punch-hole)</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">شريط التنقل السفلي</span>
              <span>SF Frosted Tab Bar (52 pt + 34 pt Home Bar)</span>
              <span>Material 3 Navigation Bar (58 dp + 16 dp)</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">تدرج الحواف (Corner Radius)</span>
              <span>Continuous Squircle: 16–20 pt</span>
              <span>Material Rounded: 12–16 dp</span>
            </div>

            <div className="grid grid-cols-3 p-3 items-center">
              <span className="font-semibold text-muted">التنبيهات التفاعلية</span>
              <span>Dynamic Island & Live Activities</span>
              <span>Material 3 Heads-up Notifications</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
