import React from 'react';
import {
  Repeat,
  Handshake,
  Scale,
  EyeOff,
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
  MessageCircle,
  HandCoins,
  KeyRound,
  FileCheck2,
  MessageSquareHeart,
} from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BRAND, whatsappLink } from '../config/brand';
import { RoleSwitch, HomeRole } from '../components/RoleSwitch';

export type RulesTab = 'seller' | 'buyer' | 'swap';

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

interface TabContent {
  sub: string;
  golden: Rule[];
  rules: Rule[];
  forbidden: string[];
  dayTitle: string;
  day: Rule[];
  dayCols: string;
  cta: { label: string; page: PageId };
}

const ROLE_OF_TAB: Record<RulesTab, HomeRole> = { seller: 'sell', buyer: 'buy', swap: 'swap' };
const TAB_OF_ROLE: Record<HomeRole, RulesTab> = { sell: 'seller', buy: 'buyer', swap: 'swap' };

/* Same bar as the home page: stays while scrolling and the whole page follows it. */
export const RulesTabBar: React.FC<{ tab: RulesTab; onTabChange: (tab: RulesTab) => void }> = ({ tab, onTabChange }) => {
  return (
    <div className="sticky top-24 sm:top-28 z-30 bg-brand-ink shadow-md">
      <div className="page-wrap py-2 flex justify-center">
        <RoleSwitch role={ROLE_OF_TAB[tab]} onChange={(r) => onTabChange(TAB_OF_ROLE[r])} />
      </div>
    </div>
  );
};

export const RulesPage: React.FC<RulesPageProps> = ({ tab, onTabChange, onNavigate }) => {
  const { tx } = useLanguage();
  const fee = BRAND.buyerFeePercent;
  const dep = BRAND.depositPercent;

  const content: Record<RulesTab, TabContent> = {
    seller: {
      sub: tx('قواعد بسيطة بتحميك وانت بتبيع وحدتك.', 'Simple rules that protect you when you sell your unit.'),
      golden: [
        { icon: Ban, t: tx('صفر أوفر برايس', 'Zero overprice'), d: tx('السعر هو اللي دفعته. مش جنيه زيادة.', 'The price is what you paid. Not a pound more.') },
        { icon: HandCoins, t: tx('التنازل في مقر المطور', 'Transfer at the developer'), d: tx('التنازل بيتم رسمي في مقر المطور، وبتقبض بشيك مصرفي.', 'The transfer is signed at the developer, and you are paid by bank cheque.') },
        { icon: FileCheck2, t: tx('كل حاجة مكتوبة', 'Everything in writing'), d: tx('المديونية والرسوم بتتكتب في إعلانك قبل ما المشتري يقرر.', 'Dues and fees are listed on your unit before a buyer decides.') },
      ],
      rules: [
        { icon: UserCheck, t: tx('الملّاك بس — مفيش سماسرة', 'Owners only — no brokers'), d: tx('العقد باسمك، أو معاك توكيل رسمي بنراجعه. ممنوع السماسرة والوسطاء يعرضوا وحدات، وأي وحدة يبان إنها من وسيط بتتشال نهائياً.', 'The contract is in your name, or you hold a formal power of attorney we review. Brokers and middlemen may not list; any unit found to come from one is removed for good.') },
        { icon: Tag, t: tx('السعر = اللي دفعته / صفر عموله عليك', 'Price = what you paid / zero fee for you'), d: tx(' تقدر تعمل خصم على سعر الوحده ، بس ما تقدرش تزوّد.\nمش هتدفع لينا ولا جنيه عموله', "You can offer a discount on the unit price, but you can't add anything on top.\nYou won't pay us a single pound in fees.") },
        { icon: AlertTriangle, t: tx('قول على المديونية', 'Declare all dues'), d: tx('أي أقساط متأخرة أو غرامات لازم تتكتب. لو اتخبّت، الإعلان بيتشال.', 'Any overdue installments or fines must be listed. Hidden dues get the listing removed.') },
        { icon: FileSearch, t: tx('مراجعة قبل النشر', 'Reviewed before listing'), d: tx('بنراجع العقد وكشف الحساب خلال 24 ساعة.', 'We check the contract and statement within 24h.') },
        { icon: FileSignature, t: tx('وعد بيع مكتوب', 'A written promise of sale'), d: tx('لما تتفق مع المشتري بيتكتب بينكم وعد بيع في مقر شركتنا، فيه كل البنود الخاصة بالوحدة والسعر.', 'Once you agree with a buyer, you both sign a promise of sale at our office, with all unit terms and the price.') },
        { icon: HandCoins, t: tx('ضريبه التصرفات العقاريه', 'Real-estate disposal tax'), d: tx(`هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي عربون ${dep}% من إجمالي قيمة الوحدة ليسدد ضريبة التصرفات العقارية، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.`, `When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, a deposit of ${dep}% of the total unit value, to pay the real-estate disposal tax. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.`) },
        { icon: Building2, t: tx('حجز الميعاد لجلسه التنازل عند المطور', 'Booking the transfer session at the developer'), d: tx('بعد توقيع عقد وعد البيع بين البايع و المشترى يقوم البايع بحجز معاد لجلسه التنازل عند المطور و بتبلغنا بيه.', 'After the seller and buyer sign the promise of sale, the seller books a date for the transfer session at the developer and lets us know.') },
        { icon: Building2, t: tx('تقبض في مقر المطور', 'Paid at the developer'), d: tx('بتجيب معاك أصل عقد الوحدة و مستندات الوحده، وبتقبض بشيك مصرفي، وشيكاتك القديمة بترجعلك في نفس اليوم.', 'You bring the original unit contract and the unit documents, you are paid by bank cheque, and your old cheques are returned the same day.') },
        { icon: MessageSquareHeart, t: tx('مصلحتك فين', 'Where your interest lies'), d: tx('بنعرض عليك كل الاختيارات، وهننصحك لو الأحسن ليك إنك تكمّل تعقدك أو تبدّل وحدتك.', "We lay out every option, and we'll advise you if you're better off keeping your contract or swapping your unit.") },
        { icon: Undo2, t: tx('حرية الانسحاب', 'You can withdraw'), d: tx('قبل التوقيع على عقد وعد البيع، ودون أي تكلفة.', 'Before signing the promise of sale, at no cost.') },
      ],
      forbidden: [
        tx('تتنازل عن الوحده قبل الاطلاع على الشيك المصرفى.', 'Transferring the unit before seeing the bank cheque.'),
        tx('تسلّم أصل العقد أو الشيكات لحد قبل التنازل.', 'Handing over the original contract or cheques before transfer'),
      ],
      dayTitle: tx('يوم التنازل بيحصل إيه؟', 'What happens on transfer day?'),
      day: [
        { icon: Building2, t: tx('انت والمشتري في مقر المطور', 'You and the buyer at the developer'), d: tx('ومعاكم مستشار من عندنا', 'With one of our advisors') },
        { icon: Banknote, t: tx('تستلم شيك مصرفي', 'You receive a bank cheque'), d: tx('بإجمالي اللي سددته من تمن الوحدة طبقًا للعقد، مخصوم منه العربون اللي استلمته', 'For the total you paid towards the unit price per the contract, minus the deposit you received') },
        { icon: FileSignature, t: tx('توقيع الطرفين على عقد التنازل', 'Both parties sign the transfer contract'), d: tx('عند المطور', 'At the developer') },
        { icon: Undo2, t: tx('شيكاتك القديمة بترجعلك', 'Your old cheques come back'), d: tx('في نفس اليوم', 'The same day') },
      ],
      dayCols: 'lg:grid-cols-4',
      cta: { label: tx('اعرض وحدتك', 'List your unit'), page: 'sell' },
    },
    buyer: {
      sub: tx('قواعد بسيطة بتحميك وانت بتشتري وحدة.', 'Simple rules that protect you when you buy a unit.'),
      golden: [
        { icon: Ban, t: tx('صفر أوفر برايس', 'Zero overprice'), d: tx('بتدفع اللي البايع دفعه. مش جنيه زيادة.', 'You pay what the seller paid. Not a pound more.') },
        { icon: HandCoins, t: tx('التنازل في مقر المطور', 'Transfer at the developer'), d: tx('التنازل بيتم رسمي في مقر المطور، وبتدفع بشيك مصرفي.', 'The transfer is signed at the developer, and you pay by bank cheque.') },
        { icon: FileCheck2, t: tx('كل حاجة مكتوبة', 'Everything in writing'), d: tx('المديونية والرسوم مكتوبة في الإعلان قبل ما تقرر.', 'Dues and fees are listed before you decide.') },
      ],
      rules: [
        { icon: Banknote, t: tx('تدفع اللي البايع دفعه بس', 'Pay only what the seller paid'), d: tx('والباقي أقساط للمطور بنفس نظامها القديم.', 'The rest continues as installments to the developer, on the same original plan.') },
        { icon: HandCoins, t: tx('العربون', 'Deposit'), d: tx(`هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي عربون ${dep}% من إجمالي قيمة الوحدة، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.`, `When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, a deposit of ${dep}% of the total unit value. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.`) },
        { icon: Percent, t: tx(`عمولتنا ${fee}% من إجمالي قيمة الوحدة طبقًا للعقد`, `Our fee is ${fee}% of the total unit value per the contract`), d: tx('بشيك مصرفي في جلسة إتمام التنازل عند المطور. لو التنازل ما تمش لأي سبب، مفيش عمولة على حد.', "By bank cheque at the transfer session at the developer. If the transfer doesn't complete, for any reason, nobody pays a fee.") },
        { icon: Receipt, t: tx('رسوم التنازل على المشتري', 'Transfer fee is on the buyer'), d: tx('رسوم التنازل عند المطور بيدفعها المشتري، وقيمتها بتختلف حسب المطور.', "The developer's transfer fee is paid by the buyer; the amount differs by developer.") },
        { icon: Eye, t: tx('إنك تقول مهتم ببلاش', 'Showing interest is free'), d: tx('اضغط "مهتم بالشراء" من صفحة الوحدة وفريقنا يكلّمك يكمّل معاك.', 'Tap "Interested in buying" on the unit page and our team calls you to go ahead.') },
        { icon: FileSignature, t: tx('وعد بيع مكتوب', 'A written promise of sale'), d: tx('لما تتفق مع البايع بيتكتب بينكم وعد بيع في مقر شركتنا، فيه كل البنود الخاصة بالوحدة والسعر.', 'Once you agree with the seller, you both sign a promise of sale at our office, with all unit terms and the price.') },
        { icon: FileCheck2, t: tx('صور الشيكات للمراجعة', 'Cheque copies for review'), d: tx('بعد توقيع عقد وعد البيع بتبعت للشركة صورة الشيك المصرفي الخاص بمستحقات البايع وصورة شيك العمولة للمراجعة.', "After signing the promise of sale, you send the company a copy of the bank cheque for the seller's dues and a copy of the fee cheque for review.") },
        { icon: AlertTriangle, t: tx('المتأخرات مش عليك', "Overdues aren't on you"), d: tx('بتتسدد للمطور يوم التنازل وتتخصم من البايع.', "They're settled on transfer day and deducted from the seller.") },
        { icon: FileSignature, t: tx('العقد بيبقى باسمك', 'The contract becomes yours'), d: tx('بعد التنازل العقد والشيكات الجديدة باسمك.', 'After transfer, the contract and new cheques are in your name.') },
        { icon: Undo2, t: tx('تقدر تنسحب', 'You can withdraw'), d: tx('تقدر تنسحب في أي وقت قبل توقيع عقد وعد البيع.', 'You can back out any time before signing the promise of sale.') },
      ],
      forbidden: [
        tx('تحوّل فلوس على حساب شخصي', 'Transferring money to a personal account'),
        tx(`تصدّق حد بيقول إنه من طرفنا من غير ما تتأكد على ${BRAND.hotline}`, `Trusting anyone claiming to be us without checking on ${BRAND.hotline}`),
      ],
      dayTitle: tx('يوم التنازل بيحصل إيه؟', 'What happens on transfer day?'),
      day: [
        { icon: Building2, t: tx('انت والبايع في مقر المطور', 'You and the seller at the developer'), d: tx('ومعاكم مستشار من عندنا', 'With one of our advisors') },
        { icon: Banknote, t: tx('تسلّم البايع شيك مصرفي', 'You hand the seller a bank cheque'), d: tx('بإجمالي اللي البايع سدده من تمن الوحدة طبقًا للعقد، مخصوم منه العربون اللي دفعته', 'For the total the seller paid towards the unit price per the contract, minus the deposit you paid') },
        { icon: Receipt, t: tx('مصاريف التنازل', 'Transfer fees'), d: tx('بتدفعها عند المطور', 'You pay them at the developer') },
        { icon: FileSignature, t: tx('توقيع الطرفين على عقد التنازل', 'Both parties sign the transfer contract'), d: tx('عند المطور', 'At the developer') },
        { icon: KeyRound, t: tx('دفتر شيكات جديد', 'A new cheque book'), d: tx('باسمك، عشان تكمّل الأقساط', 'In your name, to continue the plan') },
        { icon: Percent, t: tx('عمولتنا', 'Our fee'), d: tx(`${fee}% من إجمالي قيمة الوحدة طبقًا للعقد، بشيك مصرفي بتسلّمه لمندوب الشركة في جلسة إتمام التنازل عند المطور`, `${fee}% of the total unit value per the contract, by bank cheque handed to our representative at the transfer session at the developer`) },
      ],
      dayCols: 'lg:grid-cols-3',
      cta: { label: tx('تصفح الوحدات', 'Browse units'), page: 'opportunities' },
    },
    swap: {
      sub: tx('قواعد بسيطة بتحميك وانت بتبدّل وحدتك.', 'Simple rules that protect you when you swap your unit.'),
      golden: [
        { icon: Handshake, t: tx('موافقة الطرفين', 'Both owners agree'), d: tx('مفيش بدل غير بموافقة المالكين الاتنين.', 'No swap without both owners saying yes.') },
        { icon: HandCoins, t: tx('التنازل في مقر المطور', 'Transfer at the developer'), d: tx('التنازل بيتم رسمي في نفس اليوم عند كل مطور، والفرق بشيك مصرفي.', 'The transfers are signed officially on the same day at each developer, and the difference is paid by bank cheque.') },
        { icon: FileCheck2, t: tx('كل حاجة مكتوبة', 'Everything in writing'), d: tx('مديونية الوحدتين مكتوبة قبل ما تقرر.', "Both units' dues are in writing before you decide.") },
      ],
      rules: [
        { icon: FileSearch, t: tx('مراجعة العقدين', 'Both contracts checked'), d: tx('بنراجع العقدين، وبنساعدكم في تقييم الوحدتين.', 'We review both contracts and help you value both units.') },
        { icon: Scale, t: tx('الفرق بسعر النهارده', "The difference at today's price"), d: tx('بيتحسب بعد تحديد سعر الوحدتين النهارده، واللي بيتدفع هو الفرق بين الوحدتين بس.', "It's worked out after setting both units' price today, and only the difference between them is paid.") },
        { icon: Banknote, t: tx('الفرق بشيك مصرفي', 'The difference by bank cheque'), d: tx('بيستلمه صاحب الوحدة الأعلى سعرًا من الطرف التاني في جلسة التنازل.', 'The owner of the pricier unit receives it from the other side at the transfer session.') },
        { icon: Receipt, t: tx('ضريبة التصرفات العقارية ورسوم التنازل', 'Disposal tax and transfer fee'), d: tx(' يسدد الطرفين ضريبه التصرفات العقارية عند المطور الخاص بكل طرف , اما رسوم التنازل يسددها المتنازل إليه للمطور التابع للمتنازل .', "Each side pays the disposal tax at their own developer, while the transfer fee is paid by the transferee to the transferor's developer.") },
        { icon: Repeat, t: tx('التنازل', 'The transfer'), d: tx('التنازل لكل طرف بيتم فى نفس اليوم فى وجود المستشار العقارى الخاص بشركتنا.', "Each side's transfer takes place on the same day, with our real-estate advisor present.") },
        { icon: KeyRound, t: tx('كل واحد يكمّل أقساط اللي خده', 'Each carries on the plan they took'), d: tx('اثناء جلسه التنازل بيستلم المتنازل شيكاته القديمه من المطور التى تخص الاقساط المتبقيه و بيقدم المتنازل اليه شيكات جديده بنفس قيمه الاقساط و مدد السداد.', 'During the transfer session, the transferor receives from the developer their old cheques for the remaining installments, and the transferee provides new cheques with the same installment amounts and payment periods.') },
        { icon: Percent, t: tx(`عمولتنا ${fee}%  على كل طرف`, `Our ${fee}% from each side`), d: tx('كل طرف بيسدد 1.25% من اجمالى سعر الوحده الى هتتنقل ملكيتها اليه ', 'Each side pays 1.25% of the total price of the unit whose ownership passes to them.') },
        { icon: EyeOff, t: tx('سرية بياناتك', 'Your details stay hidden'), d: tx('اسمك ورقمك مش بيظهروا لأي طرف.', 'Nobody sees your name or number.') },
      ],
      forbidden: [
        tx('تحوّل فلوس على حساب شخصي', 'Transferring money to a personal account'),
        tx('تسلّم أصل العقد أو الشيكات لحد قبل التنازل', 'Handing over the original contract or cheques before transfer'),
        tx(`تصدّق حد بيقول إنه من طرفنا من غير ما تتأكد على ${BRAND.hotline}`, `Trusting anyone claiming to be us without checking on ${BRAND.hotline}`),
      ],
      dayTitle: tx('يوم البدل بيحصل إيه؟', 'What happens on swap day?'),
      day: [
        { icon: Building2, t: tx('المالكين عند كل مطور', 'Both owners at each developer'), d: tx('ومعاكم مستشار من عندنا', 'With one of our advisors') },
        { icon: Banknote, t: tx('الفرق بشيك مصرفي', 'The difference by bank cheque'), d: tx('لصاحب الوحدة الأعلى سعرًا، في جلسة التنازل', 'To the owner of the pricier unit, at the transfer session') },
        { icon: FileSignature, t: tx('توقيع الطرفين على عقدي التنازل', 'Both owners sign the two transfer contracts'), d: tx('عند كل مطور، في نفس اليوم', 'At each developer, on the same day') },
        { icon: KeyRound, t: tx('كل واحد يكمّل الأقساط', 'Each continues the plan'), d: tx('أقساط الوحدة اللي خدها', 'For the unit they took') },
        { icon: Percent, t: tx('عمولتنا', 'Our fee'), d: tx(`${fee}% من كل طرف من إجمالي سعر الوحدة اللي هتتنقل ملكيتها إليه، بشيك مصرفي في جلسة التنازل`, `${fee}% from each side, of the total price of the unit whose ownership passes to them, by bank cheque at the transfer session`) },
      ],
      dayCols: 'lg:grid-cols-5',
      cta: { label: tx('بدّل وحدتك', 'Swap your unit'), page: 'swap' },
    },
  };

  const { sub, golden, rules, forbidden, dayTitle, day, dayCols, cta } = content[tab];

  return (
    <div>
      <RulesTabBar tab={tab} onTabChange={onTabChange} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('حقوقك والتزاماتك', 'Rights & duties')}</h1>
        <p className="mt-2 text-muted">{sub}</p>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {golden.map((g) => (
            <div key={g.t} className="rounded-card bg-brand-ink text-white p-6">
              <g.icon className="w-7 h-7 text-accent-light" />
              <p className="mt-4 text-lg font-bold">{g.t}</p>
              <p className="mt-1 text-white/70 text-[15px]">{g.d}</p>
            </div>
          ))}
        </div>

        <ol className="mt-6 grid sm:grid-cols-2 gap-3">
          {rules.map((r, i) => (
            <li key={r.t} className="card p-5 flex gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-accent-soft text-accent shrink-0">
                <r.icon className="w-6 h-6" />
              </span>
              <div>
                <p className="font-bold text-ink">
                  <span className="num text-accent me-1.5">{i + 1}.</span>
                  {r.t}
                </p>
                <p className="mt-1 text-ink-soft text-[15px] leading-relaxed whitespace-pre-line">{r.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex justify-center">
          <button onClick={() => onNavigate('promise')} className="btn-ghost">
            <FileSignature className="w-5 h-5 text-brand" />
            {tx('تفاصيل عقد وعد البيع', 'Promise of sale details')}
          </button>
        </div>

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
          <h2 className="text-2xl font-bold text-ink">{dayTitle}</h2>
          <ol className={`mt-6 grid sm:grid-cols-2 ${dayCols} gap-3`}>
            {day.map((s, i) => (
              <li key={s.t} className="relative card p-5">
                <span className="absolute top-4 end-5 num text-4xl font-bold text-accent">{i + 1}</span>
                <s.icon className="w-6 h-6 text-accent" />
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
            <button onClick={() => onNavigate(cta.page)} className="btn-primary flex-1 whitespace-nowrap">
              {cta.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
