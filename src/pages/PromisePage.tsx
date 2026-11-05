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
  /** Numbered steps under the text. */
  steps?: string[];
  /** Takes the whole row on desktop. */
  wide?: boolean;
  /** A numbered stage (first, second): the word before the colon stands out in orange. */
  stage?: boolean;
}

interface Section {
  title: string;
  clauses: Clause[];
}

export const PromisePage: React.FC<PromisePageProps> = ({ tab, onTabChange, onNavigate }) => {
  const { tx } = useLanguage();
  const fee = BRAND.buyerFeePercent;
  const dep = BRAND.depositPercent;

  const developerRefuses: Clause = {
    t: tx('لو المطور ما وافقش', "If the developer doesn't approve"),
    d: tx('وعد البيع بيتفسخ، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, and nobody owes the other side or us anything.'),
  };

  // Shared by the buyer's and the seller's pages: same contract, same wording.
  const term: Clause = { t: tx('مدة عقد وعد البيع', 'Promise of sale term'), d: tx('ساري بحد أقصى شهرين من تاريخ تحرير العقد، ويمكن مد فترة التعاقد في حالة موافقة البايع والمشتري.', 'Valid for up to two months from the date the contract is drawn up. The term can be extended if the seller and buyer agree.') };
  const otherCosts: Clause = {
    t: tx('تحديد المصاريف بالتفصيل', 'Costs in detail'),
    d: tx('يتم تحديد المصاريف و الالتزامات الماديه التى تخص كل طرف سواء البايع او المشترى بالتفصيل زى فروق الصيانه , زياده وديعه الصيانه , رسوم الملكيه , رسوم التنازل و ضرائب التصرفات العقاريه.', 'Maintenance differences, any maintenance deposit increase, ownership transfer fees, and property taxes up to the completion of the transfer at the developer. A table in the promise of sale says who pays each, and both sides sign it.'),
  };
  // The same two stages for the buyer and the seller.
  const afterSigning: Clause = {
    t: tx('أولًا: بعد توقيع عقد وعد البيع', 'First: after signing the promise of sale'),
    d: tx(
      'بعد توقيع البايع والمشتري على عقد وعد البيع وسداد المشتري العربون للبايع، يقوم البايع بتحديد موعد لجلسة التنازل عند المطور، والتأكيد على قيمة الغرامات أو المبالغ المستحقة للوحدة، وسداد التصرفات العقارية إذا تطلب الأمر، وذلك بإيميل يرسله البايع لشركتنا.',
      'After the seller and buyer sign the promise of sale and the buyer pays the seller the deposit, the seller sets a date for the transfer session at the developer, confirms the fines or amounts due on the unit, and pays the disposal tax if needed, all by an email the seller sends to our company.',
    ),
    wide: true,
    stage: true,
  };
  const transferSession: Clause = {
    t: tx('ثانيًا: أثناء جلسة التنازل عند المطور', 'Second: during the transfer session at the developer'),
    d: tx('يجب حضور البايع والمشتري والمستشار العقاري التابع لشركتنا.', 'The seller, the buyer and our real-estate advisor must all attend.'),
    steps: [
      tx('يتم أولًا سداد كل الغرامات والمتأخرات بشيك مصرفي أو نقدًا طبقًا للمطور.', 'First, all fines and overdues are paid by bank cheque or in cash, as the developer requires.'),
      tx('يسدد المشتري رسوم التنازل عند المطور، اللي قيمتها بتختلف من مطور لآخر.', "The buyer pays the developer's transfer fee, which differs from one developer to another."),
      tx('يتم التوقيع على التنازل بين البايع والمشتري.', 'The seller and buyer sign the transfer.'),
      tx('يستلم البايع شيكاته القديمة عن الأقساط المتبقية على الوحدة.', 'The seller receives their old cheques for the installments remaining on the unit.'),
      tx('يقدّم المشتري شيكات جديدة على نفس الأقساط بنفس المبالغ ونفس طريقة السداد.', 'The buyer provides new cheques for the same installments, with the same amounts and payment method.'),
      tx('يسلّم المشتري للبايع شيك مصرفي بإجمالي اللي البايع سدده من تمن الوحدة طبقًا للعقد، مخصوم منه العربون والمبالغ سالفة الذكر.', 'The buyer hands the seller a bank cheque for the total the seller paid towards the unit price per the contract, minus the deposit and the amounts above.'),
      tx(`يسلّم المشتري للمستشار العقاري التابع لشركتنا شيك مصرفي الخاص بالعمولة، بما يعادل ${fee}% من إجمالي قيمة الوحدة العقارية.`, `The buyer hands our real-estate advisor the bank cheque for the fee, equal to ${fee}% of the total unit value.`),
    ],
    wide: true,
    stage: true,
  };

  const contractRules: Section = {
    title: tx('قواعد عقد وعد البيع', 'Promise of sale rules'),
    clauses: [
      { t: tx('المكتوب بس هو اللي بيتحسب', 'Only what is written counts'), d: tx('أي اتفاق تاني، شفهي أو مش مكتوب، مش بيتحسب. وأي تعديل لازم يبقى في ملحق موقّع من الأطراف.', 'Any other agreement, spoken or not in writing, does not count. Any change needs an annex signed by the parties.') },
      { t: tx('العناوين', 'Addresses'), d: tx('العنوان المكتوب في عقد وعد البيع هو اللي بتوصل عليه أي إخطارات، ولو غيرته لازم تبلّغنا، وإحنا بدورنا نبلّغ الطرف التاني.', 'Notices go to the address in the promise of sale. If yours changes, you must tell us, and we will tell the other side.') },
      { t: tx('استحقاق العمولة', 'Fee entitlement'), d: tx(`إذا تم التنازل عند المطور بدون حضور مستشار شركتنا لأي سبب، فإن ذلك لا ينفي أبدًا استحقاق الشركة للعمولة ${fee}% من إجمالي قيمة الوحدة، ويجب على المشتري سدادها بشيك مصرفي دون حاجة لاتخاذ إجراءات قانونية.`, `If the transfer takes place at the developer without our advisor present, for any reason, this never cancels the company's right to its ${fee}% fee on the total unit value, and the buyer must pay it by bank cheque without any need for legal action.`) },
      { t: tx('نسخ العقد', 'Contract copies'), d: tx('يُحرر العقد من 3 نسخ: كل طرف ياخد نسخة موقّعة، والنسخة التالتة لشركتنا بنستخدمها في إنهاء إجراءات التنازل.', 'The contract is drawn up in 3 copies: each party takes a signed copy, and the third is for our company, which we use to complete the transfer procedures.') },
    ],
  };

  const sections: Record<RulesTab, Section[]> = {
    buyer: [
      {
        title: tx('بيانات العقد', 'Contract details'),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش أي موانع تمنعهم من التصرف في الوحدة.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that nothing prevents them from disposing of the unit.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('اسم المطور، اسم المشروع، المنطقة، نوع الوحدة ورقمها، تفاصيل الوحدة طبقًا لعقد الوحدة.', 'Developer name, project name, area, unit type and number, and unit details per the unit contract.') },
          { t: tx('السعر', 'The price'), d: tx('المبلغ اللي البايع دفعه ناقص أي خصم متفق عليه، من غير أوفر برايس.', 'What the seller paid, less any agreed discount. No overprice.') },
          { t: tx('العربون', 'Deposit'), d: tx(`هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي عربون ${dep}% من إجمالي قيمة الوحدة، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.`, `When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, a deposit of ${dep}% of the total unit value. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.`) },
          { t: tx('الأقساط الباقية / المتأخرات', 'Remaining installments'), d: tx('الاقساط الباقيه بتكملها للمطور فى جلسه التنازل  وبتاخد مكان البايع في كل التزاماته امام المطور. (المتأخرات) ان وجدت تسدد يوم التنازل و تخصم من البايع.', "You continue them with the developer, and take the seller's place in all obligations to the developer.") },
          term,
        ],
      },
      {
        title: tx('عليك إيه بعد عقد وعد البيع؟', 'What you commit to after the promise of sale'),
        clauses: [
          afterSigning,
                    { t: tx('معاينة الوحدة', 'Inspecting the unit'), d: tx('بتوافق تستلم الوحدة بالحالة اللي عاينتها عليها. ولو لسه بتتبني، على حسب الرسومات اللي في ورق المطور.', "You accept the unit as you inspected it. If it's still being built, as shown in the developer's drawings.") },
          { t: tx('صور الشيكات للمراجعة', 'Cheque copies for review'), d: tx('بعد توقيع عقد وعد البيع بتبعت للشركة صورة الشيك المصرفي الخاص بمستحقات البايع وصورة شيك العمولة للمراجعة.', "After signing the promise of sale, you send the company a copy of the bank cheque for the seller's dues and a copy of the fee cheque for review.") },
                             { t: tx('دفتر شيكات جديد', 'A new cheque book'), d: tx('بتجيبه يوم التنازل باسمك، عشان تكمّل الأقساط.', 'You bring it on transfer day in your name, to continue the plan.') },
          otherCosts,
          transferSession,
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('قبل التوقيع على عقد وعد البيع تقدر تلغي بدون تكلفة.', 'Before signing the promise of sale, you can cancel at no cost.') },
          { t: tx('لو غيرت رأيك بعد التوقيع', 'If you change your mind after signing'), d: tx('عقد وعد البيع بيتفسخ، والعربون اللي دفعته بيبقى من حق البايع كتعويض.', 'The promise of sale is cancelled, and the deposit you paid goes to the seller as compensation.') },
          { t: tx('لو البايع رجع بعد التوقيع', 'If the seller backs out after signing'), d: tx('عقد وعد البيع بيتفسخ، والبايع بيرجعلك العربون كامل، وعليه غرامة الإلغاء.', 'The promise of sale is cancelled, the seller returns the full deposit to you, and the seller pays the cancellation penalty.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، والعربون بيرجعلك، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, the deposit comes back to you, and nobody owes the other side or us anything.') },
        ],
      },
      contractRules,
    ],
    seller: [
      {
        title: tx('بيانات العقد', 'Contract details'),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('البايع والمشتري: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش أي موانع تمنعهم من التصرف في الوحدة.', 'Seller and buyer: name, national ID and address, each confirming they can legally contract and that nothing prevents them from disposing of the unit.') },
          { t: tx('بيانات الوحدة', 'The unit'), d: tx('اسم المطور، اسم المشروع، المنطقة، نوع الوحدة ورقمها، تفاصيل الوحدة طبقًا لعقد الوحدة.', 'Developer name, project name, area, unit type and number, and unit details per the unit contract.') },
          { t: tx('السعر', 'The price'), d: tx('اللي دفعته من غير أوفر برايس، مخصوم منه أي مبلغ توافق عليه.', 'What you paid, with no overprice, less any amount you agree.') },
          { t: tx('العربون', 'Deposit'), d: tx(`هيستلم البايع من المشتري وقت توقيع عقد وعد البيع نقدًا أو بشيك مصرفي عربون ${dep}% من إجمالي قيمة الوحدة ليسدد ضريبة التصرفات العقارية، على أن تُخصم هذه القيمة من إجمالي المبلغ المسدد من المشتري للبايع مقابل التنازل عن الوحدة العقارية في مقر المطور.`, `When the promise of sale is signed, the seller receives from the buyer, in cash or by bank cheque, a deposit of ${dep}% of the total unit value, to pay the real-estate disposal tax. This amount is deducted from the total the buyer pays the seller for the transfer of the unit at the developer's office.`) },
          { t: tx('المتأخرات', 'Overdues'), d: tx('أي أقساط متأخرة أو غرامات بتتكتب، وبتتخصم منك يوم التنازل.', 'Any overdue installments or fines are listed, and deducted from you on transfer day.') },
          term,
        ],
      },
      {
        title: tx('عليك إيه بعد عقد وعد البيع؟', 'What you commit to after the promise of sale'),
        clauses: [
          afterSigning,
          { t: tx('حجز الميعاد', 'Booking the date'), d: tx('بعد وعد البيع بتحجز ميعاد التنازل مع المطور وتبلّغنا بيه.', 'After the promise of sale, you book the transfer with the developer and tell us the date.') },
          { t: tx('ضريبة التصرفات العقارية', 'Real-estate disposal tax'), d: tx('بتدفعها وبتجيب إيصال الدفع.', 'You pay it yourself and bring the payment receipt.') },
          { t: tx('الوحدة خالصة', 'A clear unit'), d: tx('بتقر إن الوحدة ملكك، ومفيش عليها رهن أو حق لحد تاني أو نزاع، وبتضمن نقل الملكية للمشتري.', 'You confirm the unit is yours, with no mortgage, third-party right or dispute, and you guarantee the transfer of ownership.') },
          { t: tx('المتأخرات و الغرامات', 'Earlier obligations'), d: tx('أي مبالغ مستحقة على الوحدة لحد تاريخ البيع , البايع ملتزم بتسددها.', 'Anything owed on the unit up to the sale date is on you.') },
          { t: tx('ما تبيعش لحد تاني', "Don't sell elsewhere"), d: tx('ممنوع بيع الوحدة لصالح شخص آخر بعد توقيع عقد وعد البيع.', 'Selling the unit to anyone else is not allowed after the promise of sale is signed.') },
          { t: tx('أصل عقد الوحدة والمستندات', 'Original unit contract and documents'), d: tx('أصل عقد الوحدة والمستندات بيتم الاطلاع عليهم ومراجعتهم عند التوقيع على عقد وعد البيع. بتسلّم  أصل عقد الوحدة والمستندات وقت التنازل عند المطور، مش قبل كده.', 'The original unit contract and documents are viewed and reviewed when the promise of sale is signed. You hand them to the buyer at the transfer at the developer, not before.') },
          { ...otherCosts, wide: true },
          transferSession,
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('قبل التوقيع على عقد وعد البيع تقدر تلغي بدون تكلفة.', 'Before signing the promise of sale, you can cancel at no cost.') },
          { t: tx('لو غيرت رأيك بعد التوقيع', 'If you change your mind after signing'), d: tx('عقد وعد البيع بيتفسخ، وبترجّع للمشتري العربون كامل، وعليك غرامة الإلغاء.', 'The promise of sale is cancelled, you return the full deposit to the buyer, and you pay the cancellation penalty.') },
          { t: tx('لو المشتري غيّر رأيه بعد التوقيع', 'If the buyer changes their mind after signing'), d: tx('لو المشتري غيّر رأيه بعد توقيع عقد وعد البيع، العربون اللي استلمته من حقك كتعويض.', 'If the buyer changes their mind after signing the promise of sale, the deposit you received is yours as compensation.') },
          { t: tx('لو المطور اعترض', 'If the developer objects'), d: tx('وعد البيع بيتفسخ، والعربون بيرجع للمشتري، ومحدش بيدفع حاجة للتاني ولا لينا.', 'The promise of sale is cancelled, the deposit goes back to the buyer, and nobody owes the other side or us anything.') },
        ],
      },
      contractRules,
    ],
    swap: [
      {
        title: tx('بيانات العقد', 'Contract details'),
        clauses: [
          { t: tx('بيانات الأطراف', 'The parties'), d: tx('المالكين: الاسم والرقم القومي والعنوان، وكل واحد بيقر إن له حق التعاقد ومفيش أي موانع تمنعه من التصرف في وحدته. وبيانات التوكيل لو حد جاي بتوكيل رسمي.', 'Both owners: name, national ID and address, each confirming they can legally contract and that nothing prevents them from disposing of their unit, plus the power of attorney if there is one.') },
          { t: tx('بيانات الوحدتين', 'Both units'), d: tx('لكل وحدة: اسم المطور، اسم المشروع، المنطقة، نوع الوحدة ورقمها، تفاصيل الوحدة طبقًا لعقد الوحدة.', 'For each unit: developer name, project name, area, unit type and number, and unit details per the unit contract.') },
          { t: tx('الفرق', 'The difference'), d: tx('بيتحسب بعد تحديد سعر الوحدتين النهارده، وإحنا بنساعدكم في التقييم. واللي بيتدفع هو الفرق بين الوحدتين بس.', "Worked out after setting both units' price today, and we help you value them. Only the difference between the units is paid.") },
          { t: tx('ضريبة التصرفات العقارية ورسوم التنازل', 'Disposal tax and transfer fee'), d: tx('التصرفات العقارية ورسوم التنازل يسددها الطرفين: ضريبة التصرفات العقارية عند المطور الخاص بكل طرف، ورسوم التنازل يسددها المتنازل إليه إلى المتنازل عند المطور التابع للمتنازل.', "Both sides pay the disposal tax and the transfer fee: the disposal tax at each side's own developer, and the transfer fee is paid by the transferee to the transferor at the transferor's developer.") },
          { t: tx('مديونية الوحدتين', "Both units' dues"), d: tx('مكتوبة قبل ما تقرر.', 'In writing before you decide.') },
          { t: tx('الوحدتين خالصين', 'Clear units'), d: tx('كل مالك بيقر إن وحدته ملكه، ومفيش عليها رهن أو حق لحد تاني أو نزاع، وبيضمن نقل ملكيتها للمالك التاني.', 'Each owner confirms their unit is theirs, with no mortgage, third-party right or dispute, and guarantees transferring it to the other owner.') },
          { t: tx('مدة عقد وعد البيع', 'Promise of sale term'), d: tx('ساري بحد أقصى شهرين من تاريخ تحرير العقد، ويمكن مد فترة التعاقد في حالة موافقة المالكين.', 'Valid for up to two months from the date the contract is drawn up. The term can be extended if both owners agree.') },
        ],
      },
      {
        title: tx('عليك إيه بعد عقد وعد البيع؟', 'What you commit to after the promise of sale'),
        clauses: [
          {
            t: tx('أولًا: بعد توقيع عقد وعد البيع', 'First: after signing the promise of sale'),
            d: tx(
              'بعد توقيع المالكين على عقد وعد البيع، يتم تحديد موعد لجلسة التنازل في نفس اليوم عند كل مطور، والتأكيد على قيمة الغرامات أو المبالغ المستحقة لكل وحدة، وسداد التصرفات العقارية إذا تطلب الأمر، وذلك بإيميل لشركتنا.',
              'After both owners sign the promise of sale, a date is set for the transfer session on the same day at each developer, the fines or amounts due on each unit are confirmed, and the disposal tax is paid if needed, all by an email to our company.',
            ),
            wide: true,
            stage: true,
          },
          { t: tx('صور الشيكات للمراجعة', 'Cheque copies for review'), d: tx('بعد توقيع عقد وعد البيع بتبعت للشركة صورة شيك العمولة، وصورة شيك الفرق لو هتدفعه، للمراجعة.', 'After signing the promise of sale, you send the company a copy of the fee cheque, and of the difference cheque if you are paying it, for review.') },
          otherCosts,
          { t: tx('أصل عقد الوحدة والمستندات', 'Original unit contract and documents'), d: tx('أصل عقد كل وحدة والمستندات بيتم الاطلاع عليهم ومراجعتهم عند التوقيع على عقد وعد البيع، وبيتسلّموا وقت التنازل عند المطور، مش قبل كده.', 'The original contract and documents of each unit are viewed and reviewed when the promise of sale is signed, and handed over at the transfer at the developer, not before.') },
          { t: tx('ما تبيعش لحد تاني', "Don't sell elsewhere"), d: tx('ممنوع بيع الوحدة لصالح شخص آخر بعد توقيع عقد وعد البيع.', 'Selling the unit to anyone else is not allowed after the promise of sale is signed.') },
          { t: tx('المتأخرات و الغرانات', 'Earlier obligations'), d: tx('أي مبالغ مستحقة على وحدتك لحد تاريخ التنازل البايع ملتزم بتسددها.', 'Anything owed on your unit up to the transfer date is on you.'), wide: true },
          {
            t: tx('ثانيًا: أثناء جلسة التنازل عند المطور', 'Second: during the transfer session at the developer'),
            d: tx('يجب حضور المالكين والمستشار العقاري التابع لشركتنا.', 'Both owners and our real-estate advisor must attend.'),
            steps: [
              tx('يتم أولًا سداد كل الغرامات والمتأخرات على الوحدتين بشيك مصرفي أو نقدًا طبقًا للمطور.', 'First, all fines and overdues on both units are paid by bank cheque or in cash, as the developer requires.'),
              tx('يتم التوقيع على التنازل بين الطرفين في نفس اليوم عند كل مطور.', 'The transfer is signed between both sides on the same day at each developer.'),
              tx('يستلم المتنازل شيكاته القديمة اللي تخص الأقساط المتبقية، ويقدّم المتنازل إليه شيكات جديدة بنفس قيمة الأقساط ومدة السداد.', 'The transferor receives their old cheques for the remaining installments, and the transferee provides new cheques with the same installment amounts and payment period.'),
              tx('صاحب الوحدة الأقل سعرًا بيسلّم المالك التاني شيك مصرفي بالفرق، حسب الاتفاق.', 'The owner of the lower-priced unit hands the other owner a bank cheque for the difference, as agreed.'),
              tx(`كل طرف بيسدد لمندوب الشركة شيك مصرفي بالعمولة: ${fee}% من إجمالي سعر الوحدة اللي هتتنقل ملكيتها إليه.`, `Each side pays our representative a bank cheque for the fee: ${fee}% of the total price of the unit whose ownership passes to them.`),
            ],
            wide: true,
            stage: true,
          },
        ],
      },
      {
        title: tx('سياسة الإلغاء', 'Cancellation policy'),
        clauses: [
          { t: tx('قبل التوقيع', 'Before signing'), d: tx('قبل التوقيع على عقد وعد البيع تقدر تلغي بدون تكلفة.', 'Before signing the promise of sale, you can cancel at no cost.') },
          { t: tx('لو غيرت رأيك بعد التوقيع', 'If you change your mind after signing'), d: tx('عقد وعد البيع بيتفسخ، وعليك غرامة الإلغاء.', 'The promise of sale is cancelled, and you pay the cancellation penalty.') },
          { t: tx('لو المالك التاني غيّر رأيه بعد التوقيع', 'If the other owner changes their mind after signing'), d: tx('عقد وعد البيع بيتفسخ، وعليه غرامة الإلغاء.', 'The promise of sale is cancelled, and they pay the cancellation penalty.') },
          developerRefuses,
        ],
      },
      {
        ...contractRules,
        clauses: contractRules.clauses.map((c) =>
          c.t === tx('استحقاق العمولة', 'Fee entitlement')
            ? {
                ...c,
                d: tx(`إذا تم التنازل عند المطور بدون حضور مستشار شركتنا لأي سبب، فإن ذلك لا ينفي أبدًا استحقاق الشركة للعمولة ${fee}% من إجمالي قيمة الوحدة، ويجب على كل مالك سدادها بشيك مصرفي دون حاجة لاتخاذ إجراءات قانونية.`, `If the transfer takes place at the developer without our advisor present, for any reason, this never cancels the company's right to its ${fee}% fee on the total unit value, and each owner must pay it by bank cheque without any need for legal action.`),
              }
            : c,
        ),
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
            <h2 className="inline-block rounded-xl bg-accent px-5 py-2.5 text-xl sm:text-2xl font-bold text-white shadow-sm">{section.title}</h2>
            <ul className="mt-5 grid sm:grid-cols-2 sm:grid-flow-row-dense gap-3">
              {section.clauses.map((c) => (
                <li key={c.t} className={`card p-5 ${c.wide ? 'sm:col-span-2' : ''}`}>
                  <p className="font-bold text-ink">
                    {c.stage ? (
                      <>
                        <span className="text-xl sm:text-2xl text-accent">{c.t.slice(0, c.t.indexOf(':') + 1)}</span>
                        {c.t.slice(c.t.indexOf(':') + 1)}
                      </>
                    ) : (
                      c.t
                    )}
                  </p>
                  <p className="mt-1 text-ink-soft text-[15px] leading-relaxed">{c.d}</p>
                  {c.steps && (
                    <ol className="mt-3 space-y-2 text-ink-soft text-[15px] leading-relaxed">
                      {c.steps.map((step, i) => (
                        <li key={step} className="flex items-start gap-2.5">
                          <span className="num grid place-items-center w-6 h-6 rounded-full bg-accent text-white text-sm font-bold shrink-0">{i + 1}</span>
                          <span className="min-w-0">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
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
