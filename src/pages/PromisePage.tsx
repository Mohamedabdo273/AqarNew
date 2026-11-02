import React from 'react';
import { MessageCircle, ScrollText } from 'lucide-react';
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

export const PromisePage: React.FC<PromisePageProps> = ({ tab, onTabChange, onNavigate }) => {
  const { tx } = useLanguage();
  const fee = BRAND.buyerFeePercent;
  const dep = BRAND.depositPercent;

  const parties = (d: string, dEn: string): Clause => ({ t: tx('بيانات الأطراف', 'The parties'), d: tx(d, dEn), proposed: true });
  const ourRole: Clause = {
    t: tx('إحنا طرف تالت كوسيط بس', "We're the third party, only as intermediary"),
    d: tx('بنوقّع على عقد وعد البيع معاكم، ودورنا نرتب التواصل وميعاد التنازل. مش بايع ولا مشتري ولا ضامن للمطور أو للوحدة، ومش بنستلم ثمن الوحدة.', "We sign the promise of sale with you, and we arrange contact and the transfer appointment. We're not the seller, the buyer or a guarantor of the developer or the unit, and we don't hold the purchase money."),
  };
  const breach: Clause = {
    t: tx('لو حد رجع في كلامه بعد التوقيع', 'If someone backs out after signing'),
    d: tx('عقد وعد البيع بيحدد مهلة التنفيذ واللي يترتب على التراجع. لسه محتاج قرار من المحامي.', 'The promise of sale sets the deadline and what follows from backing out. Still needs a decision from the lawyer.'),
    proposed: true,
  };
  const developerRefuses: Clause = {
    t: tx('لو المطور ما وافقش', "If the developer doesn't approve"),
    d: tx('وعد البيع بيتفسخ، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, and nobody owes the other side or us anything.'),
    proposed: true,
  };

  // Shared by the buyer's and the seller's pages: same contract, same wording.
  const term: Clause = { t: tx('مدة عقد وعد البيع', 'Promise of sale term'), d: tx('ساري لحد تاريخ بيتكتب فيه، أو لحد ما إجراءات التنازل تخلص عند المطور.', 'Valid until a date written in it, or until the transfer is completed at the developer.') };
  const otherCosts: Clause = {
    t: tx('المصاريف التانية', 'Other costs'),
    d: tx('فروق الصيانة، وزيادة وديعة الصيانة، والضرايب العقارية لحد التسليم، ورسوم نقل الملكية. عقد وعد البيع فيه جدول بيحدد مين عليه كل بند، والطرفين بيوقّعوا عليه.', 'Maintenance differences, any maintenance deposit increase, property taxes up to delivery and ownership transfer fees. A table in the promise of sale says who pays each, and both sides sign it.'),
  };
  const contractRules: Section = {
    title: tx('قواعد عقد وعد البيع', 'Promise of sale rules'),
    clauses: [
      { t: tx('المكتوب بس هو اللي بيتحسب', 'Only what is written counts'), d: tx('أي اتفاق تاني، شفهي أو مكتوب، مش بيتحسب. وأي تعديل لازم يبقى في ملحق موقّع من الأطراف.', 'Any other agreement, spoken or written, does not count. Any change needs an annex signed by the parties.') },
      { t: tx('العناوين', 'Addresses'), d: tx('العنوان المكتوب في عقد وعد البيع هو اللي بتوصل عليه أي إخطارات، ولو غيرته لازم تبلّغ الطرف التاني.', 'Notices go to the address in the promise of sale. If yours changes, tell the other side.') },
      { t: tx('لو حصل خلاف', 'If there is a dispute'), d: tx('بتنظره المحاكم اللي الوحدة في دايرتها.', 'It goes to the courts where the unit is located.') },
      { t: tx('النسخ', 'Copies'), d: tx('كل طرف بياخد نسخة موقّعة من عقد وعد البيع.', 'Each party keeps a signed copy.') },
    ],
  };

  const sections: Record<RulesTab, Section[]> = {
    buyer: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش قانون مانعه من التصرف. وشركتنا طرف تالت كوسيط.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that no law bars them from doing so. Our company is the third party, as intermediary.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('رقم الوحدة والمشروع والمطور والمساحة.', 'Unit number, project, developer and area.') },
          { t: tx('السعر', 'The price'), d: tx('المبلغ اللي البايع دفعه ناقص أي خصم متفق عليه، من غير أوفر برايس.', 'What the seller paid, less any agreed discount. No overprice.') },
          { t: tx(`العربون ${dep}%`, `Deposit: ${dep}%`), d: tx(`${dep}% من سعر الوحدة، بتدفعها للبايع يوم توقيع وعد البيع وبتتخصم من شيك المقدم. وتوقيعه على عقد وعد البيع بيبقى إثبات إنه استلمها.`, `${dep}% of the unit price, paid to the seller on the day of signing and taken off the down-payment cheque. Their signature on the promise of sale proves they received it.`) },
          { t: tx('شيك المقدم', 'The down-payment cheque'), d: tx('شيك مصرفي بقيمة المقدم ناقص العربون، بتسلّمه للبايع يوم التنازل عند المطور.', 'A bank cheque for the down payment minus the deposit, handed to the seller on transfer day at the developer.') },
          { t: tx('الأقساط الباقية', 'Remaining installments'), d: tx('بتكمّلها للمطور، وبتاخد مكان البايع في كل التزاماته قدام المطور.', "You continue them with the developer, and take the seller's place in all obligations to the developer.") },
          { t: tx('المتأخرات', 'Overdues'), d: tx('بتتسدد للمطور يوم التنازل وتتخصم من البايع.', "They're settled on transfer day and deducted from the seller.") },
          term,
        ],
      },
      {
        title: tx('عليك إيه؟', 'What you commit to'),
        clauses: [
          { t: tx('معاينة الوحدة', 'Inspecting the unit'), d: tx('بتوافق تستلم الوحدة بالحالة اللي عاينتها عليها. ولو لسه بتتبني، على حسب الرسومات اللي في ورق المطور.', "You accept the unit as you inspected it. If it's still being built, as shown in the developer's drawings.") },
          { t: tx('رسوم التنازل', 'Transfer fee'), d: tx('رسوم التنازل عند المطور عليك، وقيمتها بتختلف حسب المطور.', "The developer's transfer fee is yours; the amount differs by developer.") },
          { t: tx('عمولتنا', 'Our fee'), d: tx(`شيك مصرفي تاني بـ ${fee}% من إجمالي قيمة الوحدة، بعد التنازل بس.`, `A second bank cheque for ${fee}% of the total unit value, only after the transfer.`) },
          { t: tx('دفتر شيكات جديد', 'A new cheque book'), d: tx('بتجيبه يوم التنازل باسمك، عشان تكمّل الأقساط.', 'You bring it on transfer day in your name, to continue the plan.') },
          otherCosts,
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تنسحب في أي وقت قبل توقيع عقد وعد البيع.', 'You can back out any time before signing the promise of sale.') },
          { t: tx('لو انت رجعت بعد التوقيع', 'If you back out after signing'), d: tx('عقد وعد البيع بيتفسخ، والعربون بيروح للبايع كتعويض.', 'The promise of sale is cancelled, and the deposit goes to the seller as compensation.') },
          { t: tx('لو البايع رجع بعد التوقيع', 'If the seller backs out after signing'), d: tx('عقد وعد البيع بيتفسخ، والبايع بيرجعلك العربون كامل.', 'The promise of sale is cancelled, and the seller returns your full deposit.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، والعربون بيرجعلك، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, your deposit comes back, and nobody owes the other side or us anything.') },
          ourRole,
        ],
      },
      contractRules,
    ],
    seller: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش قانون مانعه من التصرف. وشركتنا طرف تالت كوسيط.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that no law bars them from doing so. Our company is the third party, as intermediary.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('رقم الوحدة والمشروع والمطور والمساحة.', 'Unit number, project, developer and area.') },
          { t: tx('السعر', 'The price'), d: tx('اللي دفعته ناقص أي خصم توافق عليه. ما ينفعش يزيد عن اللي دفعته.', 'What you paid, less any discount you agree. It can never go above what you paid.') },
          { t: tx(`العربون ${dep}%`, `Deposit: ${dep}%`), d: tx(`${dep}% من سعر الوحدة، بتستلمها من المشتري يوم توقيع وعد البيع. وتوقيعك على عقد وعد البيع بيبقى إثبات إنك استلمتها.`, `${dep}% of the unit price, received from the buyer on the day of signing. Your signature on the promise of sale proves you received it.`) },
          { t: tx('المتأخرات', 'Overdues'), d: tx('أي أقساط متأخرة أو غرامات بتتكتب، وبتتخصم منك يوم التنازل.', 'Any overdue installments or fines are listed, and deducted from you on transfer day.') },
          term,
        ],
      },
      {
        title: tx('عليك إيه؟', 'What you commit to'),
        clauses: [
          { t: tx('حجز الميعاد', 'Booking the date'), d: tx('بعد وعد البيع بتحجز ميعاد التنازل مع المطور وتبلّغنا بيه.', 'After the promise of sale, you book the transfer with the developer and tell us the date.') },
          { t: tx('ضريبة التصرفات العقارية', 'Real-estate disposal tax'), d: tx('بتدفعها انت للمطور.', 'You pay it to the developer.') },
          { t: tx('الوحدة خالصة', 'A clear unit'), d: tx('بتقر إن الوحدة ملكك، ومفيش عليها رهن أو حق لحد تاني أو نزاع، وبتضمن نقل الملكية للمشتري.', 'You confirm the unit is yours, with no mortgage, third-party right or dispute, and you guarantee the transfer of ownership.') },
          { t: tx('الالتزامات القديمة', 'Earlier obligations'), d: tx('أي مبالغ مستحقة على الوحدة لحد تاريخ البيع عليك انت.', 'Anything owed on the unit up to the sale date is on you.') },
          { t: tx('ما تبيعش لحد تاني', "Don't sell elsewhere"), d: tx('ما تبيعش الوحدة لحد تاني وهي في مرحلة اتفاق من غير ما تبلّغنا.', "Don't sell the unit elsewhere during an agreement stage without telling us.") },
          { t: tx('أصل العقد والمستندات', 'Original contract and documents'), d: tx('بتسلّمهم للمشتري عشان يتم التنازل، ومش قبل كده. وما تسلّمش أصل العقد أو الشيكات لحد قبل التنازل.', "You hand them to the buyer to complete the transfer, and not before. Don't give anyone the original contract or cheques before the transfer.") },
          otherCosts,
        ],
      },
      {
        title: tx('هتاخد إيه؟', 'What you get'),
        clauses: [
          { t: tx('شيك مصرفي', 'A bank cheque'), d: tx('بقيمة المقدم ناقص العربون اللي استلمته، بتقبضه في مقر المطور يوم التنازل.', 'For the down payment minus the deposit you received, paid at the developer on transfer day.') },
          { t: tx('شيكاتك القديمة', 'Your old cheques'), d: tx('بترجعلك في نفس اليوم.', 'Returned the same day.') },
          { t: tx('صفر عمولة', 'Zero fee'), d: tx('مش هتدفع لينا ولا جنيه.', "You don't pay us anything.") },
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تشيل إعلانك في أي وقت ومن غير تكلفة.', 'You can remove your listing any time, free.') },
          { t: tx('لو انت رجعت بعد التوقيع', 'If you back out after signing'), d: tx('عقد وعد البيع بيتفسخ، وبترجّع للمشتري العربون كامل.', 'The promise of sale is cancelled, and you return the full deposit to the buyer.') },
          { t: tx('لو المشتري رجع بعد التوقيع', 'If the buyer backs out after signing'), d: tx('عقد وعد البيع بيتفسخ، والعربون بيبقى من حقك كتعويض.', 'The promise of sale is cancelled, and you keep the deposit as compensation.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، والعربون بيرجع للمشتري، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, the deposit goes back to the buyer, and nobody owes the other side or us anything.') },
          ourRole,
        ],
      },
      contractRules,
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
          { t: tx('عمولتنا', 'Our fee'), d: tx(`كل مالك بيدفع ${fee}% من سعر الوحدة اللي بياخدها، بشيك مصرفي بعد التنازل.`, `Each owner pays ${fee}% of the price of the unit they take, by bank cheque after the transfer.`) },
          { t: tx('رسوم التنازل', 'Transfer fee'), d: tx('مين بيدفع رسوم التنازل عند المطور في البدل؟ لسه محتاج قرار.', "Who pays the developer's transfer fee in a swap? Still needs a decision."), proposed: true },
        ],
      },
      {
        title: tx('لو حصل حاجة؟', 'If something changes'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('مفيش بدل غير بموافقة المالكين الاتنين. شروط الانسحاب لسه محتاجة قرار.', 'No swap without both owners agreeing. The withdrawal terms still need a decision.'), proposed: true },
          developerRefuses,
          breach,
          ourRole,
        ],
      },
    ],
  };

  const sub: Record<RulesTab, string> = {
    buyer: tx('لما تتفق مع البايع بيتكتب عقد وعد البيع بينكم في مقر شركتنا، وإحنا طرف تالت فيه كوسيط.', 'Once you agree with the seller, you both sign a promise of sale at our office, with us as the third party, as intermediary.'),
    seller: tx('لما تتفق مع المشتري بيتكتب عقد وعد البيع بينكم في مقر شركتنا، وإحنا طرف تالت فيه كوسيط.', 'Once you agree with a buyer, you both sign a promise of sale at our office, with us as the third party, as intermediary.'),
    swap: tx('لما تتفق مع المالك التاني بيتكتب عقد وعد البيع بينكم في مقر شركتنا، وإحنا طرف تالت فيه كوسيط.', 'Once you agree with the other owner, you both sign a promise of sale at our office, with us as the third party, as intermediary.'),
  };

  return (
    <div>
      <RulesTabBar tab={tab} onTabChange={onTabChange} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('عقد وعد البيع', 'The promise of sale')}</h1>
        <p className="mt-2 text-muted">{sub[tab]}</p>

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
