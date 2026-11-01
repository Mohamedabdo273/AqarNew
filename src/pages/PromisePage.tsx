import React from 'react';
import { AlertTriangle, MessageCircle, ScrollText } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BRAND, whatsappLink } from '../config/brand';
import { RulesTab, RulesTabBar } from './RulesPage';

interface PromisePageProps {
  tab: RulesTab;
  onTabChange: (tab: RulesTab) => void;
  onNavigate: (page: PageId) => void;
}

interface Clause {
  t: string;
  d: string;
  /** Not stated anywhere else on the site yet: a suggestion waiting for legal review. */
  proposed?: boolean;
}

interface Section {
  title: string;
  clauses: Clause[];
}

/** DRAFT: the whole page is awaiting review. Remove the banner and the "proposed" flags once the wording is approved. */
export const PromisePage: React.FC<PromisePageProps> = ({ tab, onTabChange, onNavigate }) => {
  const { tx } = useLanguage();
  const fee = BRAND.buyerFeePercent;
  const tax = BRAND.disposalTaxPercent;

  const parties = (d: string, dEn: string): Clause => ({ t: tx('بيانات الطرفين', 'Both parties'), d: tx(d, dEn), proposed: true });
  const notParty: Clause = {
    t: tx('إحنا مش طرف في العقد', "We're not a party to the contract"),
    d: tx('العقد بينكم انتم الاتنين. دورنا نرتب التواصل وميعاد التنازل، ومش بنستلم ثمن الوحدة.', "The contract is between the two of you. We arrange contact and the transfer appointment, and we don't hold the purchase money."),
  };
  const breach: Clause = {
    t: tx('لو حد رجع في كلامه بعد التوقيع', 'If someone backs out after signing'),
    d: tx('العقد بيحدد مهلة التنفيذ واللي يترتب على التراجع. لسه محتاج قرار من المحامي.', 'The contract sets the deadline and what follows from backing out. Still needs a decision from the lawyer.'),
    proposed: true,
  };
  const developerRefuses: Clause = {
    t: tx('لو المطور ما وافقش', "If the developer doesn't approve"),
    d: tx('العقد بيتفسخ، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The contract is cancelled, and nobody owes the other side or us anything.'),
    proposed: true,
  };

  const sections: Record<RulesTab, Section[]> = {
    buyer: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          parties('اسمك واسم البايع والرقم القومي والعنوان، وبيانات التوكيل لو حد جاي بتوكيل رسمي.', 'Your name and the seller’s, national IDs and addresses, plus the power of attorney if there is one.'),
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('المطور والمشروع ورقم الوحدة والمساحة والتشطيب وميعاد الاستلام.', 'Developer, project, unit number, area, finishing and delivery date.'), proposed: true },
          { t: tx('السعر', 'The price'), d: tx('المبلغ اللي البايع دفعه ناقص أي خصم متفق عليه، من غير أوفر برايس.', 'What the seller paid, less any agreed discount. No overprice.') },
          { t: tx('الأقساط الباقية', 'Remaining installments'), d: tx('الباقي للمطور، وبتكمّله بنفس نظام العقد.', 'The balance goes to the developer, on the same plan as the contract.') },
          { t: tx('المتأخرات', 'Overdues'), d: tx('بتتسدد للمطور يوم التنازل وتتخصم من البايع.', "They're settled on transfer day and deducted from the seller.") },
          { t: tx('ميعاد التنازل', 'Transfer date'), d: tx('ميعاد متفق عليه في مقر المطور.', 'An agreed appointment at the developer.'), proposed: true },
        ],
      },
      {
        title: tx('عليك إيه؟', 'What you commit to'),
        clauses: [
          { t: tx('الدفع يوم التنازل', 'Payment on transfer day'), d: tx('بشيك مصرفي في مقر المطور. مفيش فلوس بتتدفع عند توقيع وعد البيع.', 'By bank cheque at the developer. No money changes hands when the promise of sale is signed.'), proposed: true },
          { t: tx(`ضريبة التصرفات العقارية ${tax}%`, `Real-estate disposal tax: ${tax}%`), d: tx(`${tax}% من سعر الوحدة، وهي على البايع. شيك البايع بيبقى مخصوم منه الضريبة، وانت بتدفعها للمطور، فمش بتزيد على اللي البايع دفعه.`, `${tax}% of the unit price, on the seller. The seller's cheque is reduced by the tax, and you pay it to the developer, so it adds nothing to what the seller paid.`) },
          { t: tx('رسوم التنازل', 'Transfer fee'), d: tx('رسوم التنازل عند المطور عليك، وقيمتها بتختلف حسب المطور.', "The developer's transfer fee is yours; the amount differs by developer.") },
          { t: tx('عمولتنا', 'Our fee'), d: tx(`${fee}% من سعر الوحدة بشيك مصرفي تاني، بعد التنازل بس.`, `${fee}% of the unit price by a second bank cheque, only after the transfer.`) },
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تنسحب في أي وقت قبل توقيع عقد وعد البيع.', 'You can back out any time before signing the promise of sale.') },
          developerRefuses,
          breach,
          notParty,
        ],
      },
    ],
    seller: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          parties('اسمك واسم المشتري والرقم القومي والعنوان، وبيانات التوكيل لو جاي بتوكيل رسمي.', 'Your name and the buyer’s, national IDs and addresses, plus your power of attorney if you hold one.'),
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('المطور والمشروع ورقم الوحدة والمساحة والتشطيب وميعاد الاستلام.', 'Developer, project, unit number, area, finishing and delivery date.'), proposed: true },
          { t: tx('السعر', 'The price'), d: tx('اللي دفعته ناقص أي خصم توافق عليه. ما ينفعش يزيد عن اللي دفعته.', 'What you paid, less any discount you agree. It can never go above what you paid.') },
          { t: tx('المتأخرات', 'Overdues'), d: tx('أي أقساط متأخرة أو غرامات بتتكتب، وبتتخصم منك يوم التنازل.', 'Any overdue installments or fines are listed, and deducted from you on transfer day.') },
          { t: tx('ميعاد التنازل', 'Transfer date'), d: tx('ميعاد متفق عليه في مقر المطور.', 'An agreed appointment at the developer.'), proposed: true },
        ],
      },
      {
        title: tx('عليك إيه؟', 'What you commit to'),
        clauses: [
          { t: tx('بيانات صحيحة', 'Accurate details'), d: tx('السعر والمدفوع والأقساط والمستندات صحيحة، ومفيش نزاع على الوحدة متخبي.', 'The price, amount paid, installments and documents are accurate, with no hidden dispute on the unit.') },
          { t: tx('ما تبيعش لحد تاني', "Don't sell elsewhere"), d: tx('ما تبيعش الوحدة لحد تاني وهي في مرحلة اتفاق من غير ما تبلّغنا.', "Don't sell the unit elsewhere during an agreement stage without telling us.") },
          { t: tx('الأصول معاك', 'Originals stay with you'), d: tx('ما تسلّمش أصل العقد أو الشيكات لحد قبل التنازل.', "Don't hand over the original contract or cheques before the transfer.") },
        ],
      },
      {
        title: tx('هتاخد إيه؟', 'What you get'),
        clauses: [
          { t: tx('شيك مصرفي', 'A bank cheque'), d: tx(`تقبض في مقر المطور يوم التنازل، باللي دفعته مخصوم منه ضريبة التصرفات العقارية (${tax}% من سعر الوحدة). المشتري هو اللي بيدفعها للمطور.`, `Paid at the developer on transfer day: what you paid, minus the disposal tax (${tax}% of the unit price). The buyer pays it to the developer.`) },
          { t: tx('شيكاتك القديمة', 'Your old cheques'), d: tx('بترجعلك في نفس اليوم.', 'Returned the same day.') },
          { t: tx('صفر عمولة', 'Zero fee'), d: tx('مش هتدفع لينا ولا جنيه.', "You don't pay us anything.") },
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تشيل إعلانك في أي وقت ومن غير تكلفة.', 'You can remove your listing any time, free.') },
          developerRefuses,
          breach,
          notParty,
        ],
      },
    ],
    swap: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          parties('اسمك واسم المالك التاني والرقم القومي والعنوان، وبيانات التوكيل لو حد جاي بتوكيل رسمي.', 'Your name and the other owner’s, national IDs and addresses, plus the power of attorney if there is one.'),
          { t: tx('بيانات الوحدتين', 'Both units'), d: tx('المطور والمشروع ورقم الوحدة والمساحة والتشطيب وميعاد الاستلام لكل وحدة.', 'Developer, project, unit number, area, finishing and delivery date for each unit.'), proposed: true },
          { t: tx('الفرق', 'The difference'), d: tx('بيتحسب على المدفوع في الوحدتين مش على سعر النهارده، وبيتحدد بعد مراجعة العقدين.', "Worked out on what was paid in both units, not today's price, and set after both contracts are reviewed.") },
          { t: tx('مديونية الوحدتين', "Both units' dues"), d: tx('مكتوبة قبل ما تقرر.', 'In writing before you decide.') },
          { t: tx('ميعاد التنازل', 'Transfer date'), d: tx('ميعاد واحد للتنازلين في مقر المطور.', 'One appointment for both transfers at the developer.'), proposed: true },
        ],
      },
      {
        title: tx('عليك إيه؟', 'What you commit to'),
        clauses: [
          { t: tx('الفرق بشيك مصرفي', 'The difference by bank cheque'), d: tx('بيستلمه صاحب الوحدة الأعلى سعرًا في مقر المطور.', 'The pricier side receives it at the developer.') },
          { t: tx('الأقساط', 'Installments'), d: tx('بعد البدل كل مالك بيكمّل أقساط الوحدة اللي خدها.', 'After the swap, each owner continues the installments of the unit they took.') },
          { t: tx('عمولتنا', 'Our fee'), d: tx(`كل مالك بيدفع ${fee}% من سعر وحدته، بشيك مصرفي بعد التنازل.`, `Each owner pays ${fee}% of their own unit's price, by bank cheque after the transfer.`) },
          { t: tx('رسوم التنازل', 'Transfer fee'), d: tx('مين بيدفع رسوم التنازل عند المطور في البدل؟ لسه محتاج قرار.', "Who pays the developer's transfer fee in a swap? Still needs a decision."), proposed: true },
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('مفيش بدل غير بموافقة المالكين الاتنين. شروط الانسحاب لسه محتاجة قرار.', 'No swap without both owners agreeing. The withdrawal terms still need a decision.'), proposed: true },
          developerRefuses,
          breach,
          notParty,
        ],
      },
    ],
  };

  const sub: Record<RulesTab, string> = {
    buyer: tx('لما تتفق مع البايع بيتكتب بينكم عقد وعد بيع، قبل التنازل في مقر المطور.', 'Once you agree with the seller, you both sign a promise of sale, before the transfer at the developer.'),
    seller: tx('لما تتفق مع المشتري بيتكتب بينكم عقد وعد بيع، قبل التنازل في مقر المطور.', 'Once you agree with a buyer, you both sign a promise of sale, before the transfer at the developer.'),
    swap: tx('لما تتفق مع المالك التاني بيتكتب بينكم عقد وعد بيع، قبل التنازلين في مقر المطور.', 'Once you agree with the other owner, you both sign a promise of sale, before both transfers at the developer.'),
  };

  return (
    <div>
      <RulesTabBar tab={tab} onTabChange={onTabChange} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('عقد وعد البيع', 'The promise of sale')}</h1>
        <p className="mt-2 text-muted">{sub[tab]}</p>

        <p className="mt-6 flex items-start gap-3 rounded-card border border-accent/40 bg-surface p-4 text-sm text-ink-soft leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-accent shrink-0" />
          {tx('مسودة لسه بتتراجع، ومش صيغة العقد النهائية. البنود اللي عليها "اقتراح" لسه محتاجة مراجعة المحامي.', 'A draft under review, not the final contract. Clauses marked "Proposed" still need the lawyer\'s review.')}
        </p>

        {sections[tab].map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-2xl font-bold text-ink">{section.title}</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {section.clauses.map((c) => (
                <li key={c.t} className="card p-5">
                  <p className="flex flex-wrap items-center gap-2 font-bold text-ink">
                    {c.t}
                    {c.proposed && <span className="rounded-full border border-accent/40 px-2 py-0.5 text-xs font-semibold text-accent">{tx('اقتراح', 'Proposed')}</span>}
                  </p>
                  <p className="mt-1 text-ink-soft text-[15px] leading-relaxed">{c.d}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => onNavigate('rules')} className="btn-ghost">
            <ScrollText className="w-5 h-5 text-brand" />
            {tx('ضمان حقك', 'Your protection')}
          </button>
          <a href={whatsappLink(tx('عندي سؤال عن عقد وعد البيع', 'I have a question about the promise of sale'))} target="_blank" rel="noreferrer" className="btn-ghost">
            <MessageCircle className="w-5 h-5 text-brand" />
            {tx('واتساب', 'WhatsApp')}
          </a>
        </div>
      </div>
    </div>
  );
};
