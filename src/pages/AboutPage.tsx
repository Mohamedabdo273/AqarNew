import React from 'react';
import {
  TrendingDown,
  Clock,
  Ban,
  Tag,
  Search,
  Repeat,
  CalendarClock,
  Radar,
  ShieldCheck,
  Wallet,
  Eye,
  Zap,
  Lock,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LogoMark } from '../components/Logo';
import { BRAND, whatsappLink } from '../config/brand';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, tx } = useLanguage();
  const name = language === 'ar' ? BRAND.nameAr : BRAND.nameEn;

  const problems = [
    { icon: TrendingDown, v: '10–15%', t: tx('غرامة لو لغيت مع المطور', 'Penalty if you cancel with the developer') },
    { icon: Clock, v: tx('لحد سنة', 'Up to a year'), t: tx('عشان فلوسك ترجعلك', 'To get your money back') },
    { icon: Ban, v: tx('إنذار', 'A warning letter'), t: tx('وبعده إلغاء لو اتأخرت في القسط', 'then cancellation if you fall behind') },
  ];

  const what = [
    { icon: Tag, t: tx('للبايع', 'For sellers'), d: tx('مش قادر تكمّل؟ تخرج من وحدتك وتاخد اللي دفعته — حتى لو عليك متأخرات — من غير عمولة.', "Can't keep up? Exit with what you paid — even with arrears — no fee."), page: 'sell' as PageId },
    { icon: Search, t: tx('للمشتري', 'For buyers'), d: tx('تشتري بسعر العقد القديم وتكمّل الأقساط.', 'Buy at the old contract price and continue the plan.'), page: 'opportunities' as PageId },
    { icon: Repeat, t: tx('للي عاوز يغيّر', 'For switchers'), d: tx('تبدّل وحدتك بوحدة قسطها يريحك، وتدفع أو تاخد الفرق.', 'Swap for a unit with a monthly you can manage, and settle the difference.'), page: 'swap' as PageId },
  ];

  const different = [
    { icon: CalendarClock, t: tx('دوّر بقسطك', 'Search by monthly'), d: tx('قولنا معاك كام وتقدر تدفع كام في الشهر', 'Tell us your cash and monthly budget') },
    { icon: Repeat, t: tx('مبادلة وحدة بوحدة', 'Unit-for-unit swap'), d: tx('من غير ما تبيع الأول', 'No need to sell first') },
    { icon: Radar, t: tx('تابع طلبك', 'Track your request'), d: tx('تعرف طلبك فين خطوة بخطوة', 'Know where it stands, step by step') },
    { icon: ShieldCheck, t: tx('مراجعة قبل النشر', 'Checked before listing'), d: tx('العقد والمديونية متراجعين مع المطور', 'Contract and dues verified with the developer') },
  ];

  const promises = [
    { icon: Eye, t: tx('وضوح', 'Clarity'), d: tx('كل رقم قدامك: المدفوع، الباقي، المديونية، والرسوم.', 'Every number upfront: paid, remaining, dues, fees.') },
    { icon: Lock, t: tx('أمان', 'Safety'), d: tx('مفيش فلوس بتتحرك غير في مقر المطور يوم التنازل.', 'No money moves except at the developer on transfer day.') },
    { icon: Zap, t: tx('سرعة', 'Speed'), d: tx('مراجعة خلال 24 ساعة، ومتابعة لحد ما تقبض.', 'Review within 24h, and support until you’re paid.') },
    { icon: Wallet, t: tx('عدل', 'Fairness'), d: tx(`البايع ما بيدفعش حاجة، والمشتري ${BRAND.buyerFeePercent}% بس.`, `Sellers pay nothing; buyers only ${BRAND.buyerFeePercent}%.`) },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-14 text-center">
        <LogoMark size={64} className="mx-auto" />
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-ink">
          {tx('احنا', 'We are')} <span className="text-brand">{name}</span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-2xl mx-auto">
          {tx(
            'بنساعد اللي مش قادر يكمّل أقساط وحدته يخرج بفلوسه كاملة، وبنوصّله بحد نفسه يشتري بسعر زمان.',
            "We help owners who can't keep up with installments exit with all their money, and connect them with buyers who want the old price."
          )}
        </p>
      </section>

      {/* The problem */}
      <section className="bg-brand text-white">
        <div className="page-wrap py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">{tx('المشكلة', 'The problem')}</h2>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {problems.map((p) => (
              <div key={p.t} className="rounded-card border border-white/10 bg-white/[0.04] p-7 text-center">
                <p.icon className="mx-auto w-7 h-7 text-accent-light" />
                <p className="num font-display mt-4 text-4xl font-bold">{p.v}</p>
                <p className="mt-2 text-white/60">{p.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="page-wrap py-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">{tx('بنعمل إيه؟', 'What we do')}</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {what.map((w) => (
            <button key={w.t} onClick={() => onNavigate(w.page)} className="card p-7 text-start transition-all hover:shadow-lift hover:-translate-y-0.5">
              <span className="grid place-items-center w-14 h-14 rounded-xl bg-brand text-white">
                <w.icon className="w-7 h-7" />
              </span>
              <p className="mt-5 text-xl font-bold text-ink">{w.t}</p>
              <p className="mt-2 text-ink-soft leading-relaxed">{w.d}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How we're different */}
      <section className="bg-surface border-y border-line">
        <div className="page-wrap py-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">{tx('إيه اللي يميّزنا؟', 'What makes us different')}</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {different.map((d) => (
              <div key={d.t} className="rounded-card bg-paper p-6">
                <d.icon className="w-7 h-7 text-ink" />
                <p className="mt-4 font-bold text-lg text-ink">{d.t}</p>
                <p className="mt-1 text-muted">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="page-wrap py-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-ink text-center">{tx('وعدنا ليك', 'Our promise')}</h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {promises.map((p) => (
            <div key={p.t} className="card p-6 flex gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-soft text-brand shrink-0">
                <p.icon className="w-6 h-6" />
              </span>
              <div>
                <p className="font-bold text-lg text-ink">{p.t}</p>
                <p className="mt-1 text-ink-soft">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <button onClick={() => onNavigate('rules')} className="font-semibold text-brand hover:underline">
            {tx('اقرا القواعد كاملة ←', 'Read the full rules →')}
          </button>
        </p>
      </section>

      {/* Contact CTA */}
      <section className="page-wrap pb-16">
        <div className="rounded-card bg-brand-ink text-white px-6 py-12 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div>
            <p className="text-2xl sm:text-3xl font-bold">{tx('عندك سؤال؟ كلمنا', 'Questions? Talk to us')}</p>
            <p className="mt-2 text-white/70">{tx('فريقنا بيرد كل يوم', 'Our team replies every day')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a href={whatsappLink(tx('مرحباً، عندي سؤال', 'Hi, I have a question'))} target="_blank" rel="noreferrer" className="btn bg-white text-brand-ink hover:bg-brand-soft min-h-13">
              <MessageCircle className="w-5 h-5" />
              {tx('واتساب', 'WhatsApp')}
            </a>
            <a href={`tel:${BRAND.hotline}`} className="btn border border-white/30 text-white hover:bg-white/10 min-h-13">
              <Phone className="w-5 h-5" />
              {BRAND.hotline}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
