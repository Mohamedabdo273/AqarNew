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

  const parties = (d: string, dEn: string): Clause => ({ t: tx('بيانات الأطراف', 'The parties'), d: tx(d, dEn), proposed: true });
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
    d: tx('فروق الصيانة، وزيادة وديعة الصيانة، ورسوم نقل الملكية، والضرايب العقارية لحد إتمام إجراءات التنازل لدى المطور. عقد وعد البيع فيه جدول بيحدد مين عليه كل بند، والطرفين بيوقّعوا عليه.', 'Maintenance differences, any maintenance deposit increase, ownership transfer fees, and property taxes up to the completion of the transfer at the developer. A table in the promise of sale says who pays each, and both sides sign it.'),
  };
  const contractRules: Section = {
    title: tx('قواعد عقد وعد البيع', 'Promise of sale rules'),
    clauses: [
      { t: tx('المكتوب بس هو اللي بيتحسب', 'Only what is written counts'), d: tx('أي اتفاق تاني، مكتوب أو مش مكتوب، مش بيتحسب. وأي تعديل لازم يبقى في ملحق موقّع من الأطراف.', 'Any other agreement, written or not, does not count. Any change needs an annex signed by the parties.') },
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
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش قانون مانعه من التصرف.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that no law bars them from doing so.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('اسم المطور، اسم المشروع، المنطقة، نوع الوحدة ورقمها، تفاصيل الوحدة طبقًا لعقد الوحدة.', 'Developer name, project name, area, unit type and number, and unit details per the unit contract.') },
          { t: tx('السعر', 'The price'), d: tx('المبلغ اللي البايع دفعه ناقص أي خصم متفق عليه، من غير أوفر برايس.', 'What the seller paid, less any agreed discount. No overprice.') },
          { t: tx('ضريبة التصرفات العقارية', 'Real-estate disposal tax'), d: tx('هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي قيمة ضريبة التصرفات العقارية، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.', "When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, the value of the real-estate disposal tax. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.") },
          { t: tx('شيك مصرفي', 'A bank cheque'), d: tx('شيك مصرفي بتسلّمه للبايع في مقر المطور وقت التنازل، بإجمالي اللي سدده من تمن الوحدة طبقًا للعقد، مخصوم منه قيمة ضريبة التصرفات العقارية اللي دفعتها له وقت التوقيع على عقد وعد البيع.', 'A bank cheque you hand the seller at the developer at the transfer, for the total they paid towards the unit price per the contract, minus the disposal tax value you paid them when the promise of sale was signed.') },
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
          { t: tx('عمولتنا', 'Our fee'), d: tx(`${fee}% من إجمالي قيمة الوحدة طبقًا للعقد، والعمولة بشيك مصرفي بتسلّمه لمندوب الشركة في جلسة إتمام التنازل عند المطور.`, `${fee}% of the total unit value per the contract, by bank cheque handed to our representative at the transfer session at the developer.`) },
          { t: tx('صور الشيكات للمراجعة', 'Cheque copies for review'), d: tx('بعد توقيع عقد وعد البيع بتبعت للشركة صورة الشيك المصرفي الخاص بمستحقات البايع وصورة شيك العمولة للمراجعة.', "After signing the promise of sale, you send the company a copy of the bank cheque for the seller's dues and a copy of the fee cheque for review.") },
          { t: tx('دفتر شيكات جديد', 'A new cheque book'), d: tx('بتجيبه يوم التنازل باسمك، عشان تكمّل الأقساط.', 'You bring it on transfer day in your name, to continue the plan.') },
          otherCosts,
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تنسحب في أي وقت قبل توقيع عقد وعد البيع.', 'You can back out any time before signing the promise of sale.') },
          { t: tx('لو غيرت رأيك بعد التوقيع', 'If you change your mind after signing'), d: tx('عقد وعد البيع بيتفسخ، وقيمة ضريبة التصرفات العقارية اللي دفعتها بتبقى من حق البايع كتعويض، بشرط تقديمه أصل إيصال سداد الضريبة للمطور.', 'The promise of sale is cancelled, and the disposal tax value you paid goes to the seller as compensation, provided they present the original receipt for paying the tax to the developer.') },
          { t: tx('لو البايع رجع بعد التوقيع', 'If the seller backs out after signing'), d: tx('عقد وعد البيع بيتفسخ، والبايع بيرجعلك قيمة ضريبة التصرفات العقارية كاملة.', 'The promise of sale is cancelled, and the seller returns the full disposal tax value to you.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، وقيمة ضريبة التصرفات العقارية بترجعلك، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, the disposal tax value comes back to you, and nobody owes the other side or us anything.') },
        ],
      },
      contractRules,
    ],
    seller: [
      {
        title: tx('بيتكتب فيه إيه؟', "What's in it?"),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش قانون مانعه من التصرف.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that no law bars them from doing so.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('اسم المطور، اسم المشروع، المنطقة، نوع الوحدة ورقمها، تفاصيل الوحدة طبقًا لعقد الوحدة.', 'Developer name, project name, area, unit type and number, and unit details per the unit contract.') },
          { t: tx('السعر', 'The price'), d: tx('اللي دفعته ناقص أي خصم توافق عليه. ما ينفعش يزيد عن اللي دفعته.', 'What you paid, less any discount you agree. It can never go above what you paid.') },
          { t: tx('ضريبة التصرفات العقارية', 'Real-estate disposal tax'), d: tx('هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي قيمة ضريبة التصرفات العقارية، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.', "When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, the value of the real-estate disposal tax. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.") },
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
          { t: tx('أصل عقد الوحدة والمستندات', 'Original unit contract and documents'), d: tx('أصل عقد الوحدة والمستندات بيتم الاطلاع عليهم ومراجعتهم عند التوقيع على عقد وعد البيع. بتسلّم المشتري أصل عقد الوحدة والمستندات وقت التنازل عند المطور، مش قبل كده.', 'The original unit contract and documents are viewed and reviewed when the promise of sale is signed. You hand them to the buyer at the transfer at the developer, not before.') },
          otherCosts,
        ],
      },
      {
        title: tx('ليك إيه؟', "What's yours"),
        clauses: [
          { t: tx('شيك مصرفي', 'A bank cheque'), d: tx('شيك مصرفي بتستلمه من المشتري في مقر المطور وقت التنازل، بإجمالي اللي سددته من تمن الوحدة طبقًا للعقد، مخصوم منه ضريبة التصرفات العقارية اللي استلمتها وقت التوقيع على عقد وعد البيع.', 'A bank cheque you receive from the buyer at the developer at the transfer, for the total you paid towards the unit price per the contract, minus the disposal tax you received when the promise of sale was signed.') },
          { t: tx('شيكاتك المتبقية', 'Your remaining cheques'), d: tx('شيكاتك المتبقية بتستلمها من المطور وقت التنازل، والمشتري بيقدم شيكات جديدة بنفس المبالغ ونفس مدد السداد.', 'You collect your remaining cheques from the developer at the transfer, and the buyer provides new cheques for the same amounts and the same payment periods.') },
          { t: tx('صفر عمولة', 'Zero fee'), d: tx('مش هتدفع لينا ولا جنيه.', "You don't pay us anything.") },
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('تقدر تشيل إعلانك في أي وقت ومن غير تكلفة.', 'You can remove your listing any time, free.') },
          { t: tx('لو غيرت رأيك بعد التوقيع', 'If you change your mind after signing'), d: tx('عقد وعد البيع بيتفسخ، وبترجّع للمشتري قيمة ضريبة التصرفات العقارية كاملة.', 'The promise of sale is cancelled, and you return the full disposal tax value to the buyer.') },
          { t: tx('لو المشتري غيّر رأيه بعد التوقيع', 'If the buyer changes their mind after signing'), d: tx('لو المشتري غيّر رأيه بعد توقيع عقد وعد البيع، قيمة ضريبة التصرفات العقارية اللي استلمتها من حقك كتعويض، بشرط تقديم أصل إيصال سداد الضريبة للمطور.', 'If the buyer changes their mind after signing the promise of sale, the disposal tax value you received is yours as compensation, provided you present the original receipt for paying the tax to the developer.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، وقيمة ضريبة التصرفات العقارية بترجع للمشتري، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, the disposal tax value goes back to the buyer, and nobody owes the other side or us anything.') },
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
          { t: tx('عمولتنا', 'Our fee'), d: tx(`كل مالك بيدفع ${fee}% من إجمالي قيمة الوحدة اللي بياخدها طبقًا للعقد، والعمولة بشيك مصرفي في جلسة إتمام التنازل عند المطور.`, `Each owner pays ${fee}% of the total value of the unit they take per the contract, paid by bank cheque at the transfer session at the developer.`) },
          { t: tx('رسوم التنازل', 'Transfer fee'), d: tx('مين بيدفع رسوم التنازل عند المطور في البدل؟ لسه محتاج قرار.', "Who pays the developer's transfer fee in a swap? Still needs a decision."), proposed: true },
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('مفيش بدل غير بموافقة المالكين الاتنين. شروط الانسحاب لسه محتاجة قرار.', 'No swap without both owners agreeing. The withdrawal terms still need a decision.'), proposed: true },
          developerRefuses,
          breach,
        ],
      },
    ],
  };

  const sub: Record<RulesTab, string> = {
    buyer: tx('لما يتفق البايع والمشتري بيوقعوا على عقد وعد البيع في مقر شركتنا.', 'Once seller and buyer agree, they sign the promise of sale at our office.'),
    seller: tx('لما يتفق البايع والمشتري بيوقعوا على عقد وعد البيع في مقر شركتنا.', 'Once seller and buyer agree, they sign the promise of sale at our office.'),
    swap: tx('لما تتفق مع المالك التاني بيتكتب عقد وعد البيع بينكم في مقر شركتنا.', 'Once you agree with the other owner, you both sign a promise of sale at our office.'),
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
            {tx('حقوقك والتزاماتك', 'Rights & duties')}
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
