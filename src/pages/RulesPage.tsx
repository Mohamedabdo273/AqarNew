import React from 'react';
import {
  UserCheck,
  Ban,
  Wallet,
  AlertTriangle,
  FileSearch,
  Building2,
  Undo2,
  Banknote,
  Percent,
  Receipt,
  Eye,
  FileSignature,
  ShieldCheck,
  XCircle,
  Tag,
  Search,
  MessageCircle,
  HandCoins,
  KeyRound,
  FileCheck2,
  EyeOff,
  MessageSquareHeart,
  BadgeCheck,
} from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BRAND, whatsappLink } from '../config/brand';

export type RulesTab = 'seller' | 'buyer';

interface RulesPageProps {
  tab: RulesTab;
  onTabChange: (tab: RulesTab) => void;
  onNavigate: (page: PageId) => void;
}

interface Rule {
  icon: React.ElementType;
  t: string;
  d: string;
}

export const RulesPage: React.FC<RulesPageProps> = ({ tab, onTabChange, onNavigate }) => {
  const { tx } = useLanguage();
  const fee = BRAND.buyerFeePercent;

  const golden: Rule[] = [
    { icon: Ban, t: tx('صفر أوفر برايس', 'Zero overprice'), d: tx('السعر هو اللي البايع دفعه. مش جنيه زيادة.', 'The price is what the seller paid. Not a pound more.') },
    { icon: HandCoins, t: tx('مفيش فلوس قبل التنازل', 'No money before transfer'), d: tx('كل الفلوس بتتدفع في مقر المطور يوم التنازل.', 'All money changes hands at the developer on transfer day.') },
    { icon: FileCheck2, t: tx('كل حاجة مكتوبة', 'Everything in writing'), d: tx('المديونية والرسوم مكتوبة في الإعلان قبل ما تقرر.', 'Dues and fees are listed before you decide.') },
    { icon: BadgeCheck, t: tx('كل رقم معروف مصدره', 'Every number shows its source'), d: tx('اللي اتأكدنا منه بالمستندات مكتوب عليه "متأكد"، والتقديري مكتوب عليه "تقديري".', 'Figures checked against documents say "verified"; estimates say "estimate".') },
  ];

  const seller: Rule[] = [
    { icon: UserCheck, t: tx('الملّاك بس — مفيش سماسرة', 'Owners only — no brokers'), d: tx('العقد باسمك، أو معاك توكيل رسمي بنراجعه. ممنوع السماسرة والوسطاء يعرضوا وحدات، وأي وحدة يبان إنها من وسيط بتتشال نهائياً.', 'The contract is in your name, or you hold a formal power of attorney we review. Brokers and middlemen may not list; any unit found to come from one is removed for good.') },
    { icon: Tag, t: tx('السعر = اللي دفعته', 'Price = what you paid'), d: tx('تقدر تعمل خصم، بس ما تقدرش تزوّد.', 'You can offer a discount, never add on top.') },
    { icon: Wallet, t: tx('صفر عمولة عليك', 'Zero fee for you'), d: tx('مش هتدفع لينا ولا جنيه.', "You don't pay us anything.") },
    { icon: AlertTriangle, t: tx('قول على المديونية', 'Declare all dues'), d: tx('أي أقساط متأخرة أو غرامات لازم تتكتب. لو اتخبّت، الإعلان بيتشال.', 'Any overdue installments or fines must be listed. Hidden dues get the listing removed.') },
    { icon: FileSearch, t: tx('مراجعة قبل النشر', 'Reviewed before listing'), d: tx('بنراجع العقد وكشف الحساب مع المطور خلال 24 ساعة.', 'We check the contract and statement with the developer within 24h.') },
    { icon: Building2, t: tx('تقبض في مقر المطور', 'Paid at the developer'), d: tx('بشيك مصرفي، وشيكاتك القديمة بترجعلك في نفس اليوم.', 'By bank cheque, and your old cheques are returned the same day.') },
    { icon: EyeOff, t: tx('تقدر تختار العرض الخاص', 'Private listing if you want'), d: tx('وحدتك ما تظهرش في الموقع خالص، وبنعرضها بس على مشترين متحقق منهم ومناسبين ليها.', "Your unit isn't shown on the site at all — only to vetted buyers who match it.") },
    { icon: MessageSquareHeart, t: tx('نصيحة بصراحة', 'Honest advice'), d: tx('بنعرض عليك كل الاختيارات، ولو الأحسن ليك إنك تكمّل تعاقدك هنقولك.', "We lay out every option — and if you're better off keeping your contract, we'll say so.") },
    { icon: Undo2, t: tx('تقدر تنسحب', 'You can withdraw'), d: tx('قبل التوقيع تشيل إعلانك في أي وقت ومن غير تكلفة.', 'Remove your listing any time before signing, free.') },
  ];

  const buyer: Rule[] = [
    { icon: Banknote, t: tx('تدفع اللي البايع دفعه بس', 'Pay only what the seller paid'), d: tx('والباقي أقساط للمطور بنفس نظامها القديم.', 'The rest continues as installments to the developer.') },
    { icon: Percent, t: tx(`عمولتنا ${fee}% بس`, `Our fee is only ${fee}%`), d: tx('من سعر العقد، وبتتدفع بس لو التنازل تم. لو ما تمش لأي سبب، مفيش عمولة على حد.', "Of the contract price, and only if the transfer completes. If it doesn't, for any reason, nobody pays a fee.") },
    { icon: Receipt, t: tx('رسوم التنازل واضحة', 'Transfer fee is clear'), d: tx('كل إعلان مكتوب فيه مين بيدفع رسوم المطور ونسبتها.', 'Every listing states who pays the developer fee and how much.') },
    { icon: Eye, t: tx('الحجز ببلاش', 'Booking is free'), d: tx('احجز من صفحة الوحدة وفريقنا يكلّمك يكمّل معاك.', 'Book from the unit page and our team calls you to go ahead.') },
    { icon: AlertTriangle, t: tx('المتأخرات مش عليك', "Overdues aren't on you"), d: tx('بتتسدد للمطور يوم التنازل وتتخصم من البايع.', "They're settled on transfer day and deducted from the seller.") },
    { icon: FileSignature, t: tx('العقد بيبقى باسمك', 'The contract becomes yours'), d: tx('بعد التنازل العقد والشيكات الجديدة باسمك.', 'After transfer, the contract and new cheques are in your name.') },
    { icon: Undo2, t: tx('تقدر تنسحب', 'You can withdraw'), d: tx('قبل التوقيع تنسحب من غير أي تكلفة.', 'Back out free before signing.') },
  ];

  const forbidden =
    tab === 'seller'
      ? [
          tx('تستلم عربون أو أي فلوس برّه يوم التنازل', 'Taking a deposit or any money outside transfer day'),
          tx('تطلب أي مبلغ فوق اللي دفعته', 'Asking for anything above what you paid'),
          tx('تسلّم أصل العقد أو الشيكات لحد قبل التنازل', 'Handing over the original contract or cheques before transfer'),
        ]
      : [
          tx('تدفع عربون أو أي فلوس قبل التنازل في مقر المطور', 'Paying a deposit or anything before the transfer at the developer'),
          tx('تحوّل فلوس على حساب شخصي', 'Transferring money to a personal account'),
          tx(`تصدّق حد بيقول إنه من طرفنا من غير ما تتأكد على ${BRAND.hotline}`, `Trusting anyone claiming to be us without checking on ${BRAND.hotline}`),
        ];

  const dealDay = [
    { icon: Building2, t: tx('الطرفين في مقر المطور', 'Both parties at the developer'), d: tx('ومعاهم مستشار من عندنا', 'With one of our advisors') },
    { icon: Banknote, t: tx('المشتري يسلّم شيك مصرفي', 'Buyer hands over a bank cheque'), d: tx('بالمبلغ اللي البايع دفعه', 'For the amount the seller paid') },
    { icon: FileSignature, t: tx('المطور ينقل العقد', 'Developer transfers the contract'), d: tx('ويرجّع للبايع شيكاته القديمة', 'And returns the seller’s old cheques') },
    { icon: KeyRound, t: tx('المشتري يكمّل الأقساط', 'Buyer continues the plan'), d: tx('بشيكات جديدة باسمه', 'With new cheques in their name') },
  ];

  const rules = tab === 'seller' ? seller : buyer;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('ضمان حقك', 'Your protection')}</h1>
      <p className="mt-2 text-muted">
        {tx('قواعد بسيطة بتحمي البايع والمشتري. النسخة القانونية الكاملة في ', 'Simple rules that protect both sides. The full legal version is in the ')}
        <button onClick={() => onNavigate('terms')} className="text-brand font-semibold hover:underline">
          {tx('الشروط والأحكام', 'Terms & conditions')}
        </button>
        .
      </p>

      {/* Golden rules — apply to everyone */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {golden.map((g) => (
          <div key={g.t} className="rounded-card bg-brand-ink text-white p-6">
            <g.icon className="w-7 h-7 text-accent-light" />
            <p className="mt-4 text-lg font-bold">{g.t}</p>
            <p className="mt-1 text-white/70 text-[15px]">{g.d}</p>
          </div>
        ))}
      </div>

      {/* Seller / buyer tabs */}
      <div className="mt-12 flex justify-center">
        <div className="inline-flex p-1 rounded-full bg-surface border border-line" role="tablist">
          {(['seller', 'buyer'] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => onTabChange(k)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold transition-colors ${tab === k ? 'bg-brand text-white' : 'text-ink-soft'}`}
            >
              {k === 'seller' ? <Tag className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              {k === 'seller' ? tx('لو هتبيع', 'If you sell') : tx('لو هتشتري', 'If you buy')}
            </button>
          ))}
        </div>
      </div>

      <ol className="mt-8 grid sm:grid-cols-2 gap-3">
        {rules.map((r, i) => (
          <li key={r.t} className="card p-5 flex gap-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-soft text-brand shrink-0">
              <r.icon className="w-6 h-6" />
            </span>
            <div>
              <p className="font-bold text-ink">
                <span className="num text-muted me-1.5">{i + 1}.</span>
                {r.t}
              </p>
              <p className="mt-1 text-ink-soft text-[15px] leading-relaxed">{r.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-card border border-danger/25 bg-surface p-6">
        <p className="flex items-center gap-2 font-bold text-danger">
          <XCircle className="w-5 h-5" />
          {tx('ممنوع', 'Never')}
        </p>
        <ul className="mt-4 grid gap-3">
          {forbidden.map((f) => (
            <li key={f} className="flex items-start gap-3 text-ink">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Transfer day */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-ink">{tx('يوم التنازل بيحصل إيه؟', 'What happens on transfer day?')}</h2>
        <ol className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dealDay.map((s, i) => (
            <li key={s.t} className="relative card p-5">
              <span className="absolute top-4 end-5 num text-4xl font-bold text-line-strong">{i + 1}</span>
              <s.icon className="w-6 h-6 text-brand" />
              <p className="mt-4 font-bold text-ink">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Help */}
      <div className="mt-14 card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-start">
        <div className="flex items-center gap-4">
          <ShieldCheck className="hidden sm:block w-10 h-10 text-brand shrink-0" />
          <div>
            <p className="text-lg font-bold text-ink">{tx('حد خالف القواعد أو عندك سؤال؟', 'Someone broke a rule, or have a question?')}</p>
            <p className="text-muted">{tx(`كلمنا على ${BRAND.hotline} أو واتساب`, `Call ${BRAND.hotline} or WhatsApp us`)}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <a href={whatsappLink(tx('عندي سؤال عن القواعد', 'I have a question about the rules'))} target="_blank" rel="noreferrer" className="btn-ghost flex-1">
            <MessageCircle className="w-5 h-5 text-brand" />
            {tx('واتساب', 'WhatsApp')}
          </a>
          <button onClick={() => onNavigate(tab === 'seller' ? 'sell' : 'opportunities')} className="btn-primary flex-1 whitespace-nowrap">
            {tab === 'seller' ? tx('اعرض وحدتك', 'List your unit') : tx('تصفح الوحدات', 'Browse units')}
          </button>
        </div>
      </div>
    </div>
  );
};
