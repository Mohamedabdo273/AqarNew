import React from 'react';
import { ScrollText } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LegalPage, LegalSection } from '../components/LegalPage';
import { BRAND, LEGAL_UPDATED } from '../config/brand';

interface TermsPageProps {
  onNavigate: (page: PageId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const { language, tx } = useLanguage();
  const name = language === 'ar' ? BRAND.nameAr : BRAND.nameEn;
  const fee = BRAND.buyerFeePercent;

  const summary = [
    tx('احنا وسيط بنوصّل البايع بالمشتري، وطرف تالت في عقد وعد البيع كوسيط بس', 'We connect sellers and buyers, and sign the promise of sale as a third party, only as intermediary'),
    tx('البايع ما بيدفعش عمولة، والمشتري بيدفع ' + fee + '% من سعر الوحدة بعد التوقيع', `Sellers pay no fee; buyers pay ${fee}% of the unit price after signing`),
    tx('المشتري يقدر ينسحب قبل توقيع عقد وعد البيع، ورسوم التنازل عند المطور عليه', 'Buyers can withdraw before signing the promise of sale; the developer transfer fee is on them'),
    tx('مفيش أوفر برايس، والتنازل رسمي بمقر المطور', 'No overprice, and official transfer at the developer'),
    tx('أي بيانات غلط أو مديونية متخبية = الإعلان بيتشال', 'False data or hidden dues = listing removed'),
  ];

  const sections: LegalSection[] = [
    {
      id: 'defs',
      title: tx('تعريفات', 'Definitions'),
      body: [
        tx(`• "المنصة": موقع وخدمات "${name}".`, `• "Platform": the "${name}" website and services.`),
        tx('• "البايع": صاحب وحدة بالتقسيط عاوز يتنازل عنها.', '• "Seller": an owner of an installment unit who wants to transfer it.'),
        tx('• "المشتري": الشخص اللي عاوز ياخد الوحدة ويكمّل أقساطها.', '• "Buyer": the person taking over the unit and its remaining installments.'),
        tx('• "التنازل": نقل العقد من البايع للمشتري رسمياً عن طريق المطور.', '• "Transfer": officially moving the contract from seller to buyer through the developer.'),
        tx('• "المطور": شركة التطوير العقاري صاحبة المشروع.', '• "Developer": the real-estate company that owns the project.'),
      ],
    },
    {
      id: 'accept',
      title: tx('الموافقة على الشروط', 'Accepting these terms'),
      body: [
        tx(
          'لما تستخدم المنصة، أو تبعت طلب بيع، أو تقولنا إنك مهتم بشراء وحدة، ده معناه إنك قريت الشروط دي و"القواعد" ووافقت عليهم، ومعاهم سياسة الخصوصية. لو مش موافق، ما تستخدمش المنصة.',
          'By using the platform, sending a sell request, or registering interest in buying a unit, you confirm you have read and accept these terms, the "Rules", and the privacy policy. If you disagree, please do not use the platform.'
        ),
      ],
    },
    {
      id: 'role',
      title: tx('دورنا بالظبط', 'Our role'),
      body: [
        tx('• احنا منصة وساطة: بنراجع البيانات، بنعرض الوحدات، وبنرتب التواصل بين البايع والمشتري وميعاد التنازل.', '• We are an intermediary: we review data, list units, and arrange contact between seller and buyer and the transfer appointment.'),
        tx('• احنا طرف تالت في عقد وعد البيع كوسيط بس: مش بايع ولا مشتري ولا ضامن للمطور أو للوحدة. ومش طرف في عقد التنازل، ومش بنستلم ثمن الوحدة.', "• We sign the promise of sale as a third party, only as intermediary: not as seller, buyer or guarantor of the developer or the unit. We are not a party to the transfer contract and we don't hold the purchase money."),
        tx('• التنازل بيتم حسب إجراءات وشروط المطور، وموافقة المطور مش في إيدنا.', "• Transfers follow the developer's procedures; the developer's approval is not in our control."),
        tx('• اللي بنقدمه معلومات ومساعدة، مش استشارة قانونية أو مالية. ننصحك تراجع العقد مع محامي لو محتاج.', '• What we provide is information and help, not legal or financial advice. Consult a lawyer if needed.'),
      ],
    },
    {
      id: 'eligible',
      title: tx('مين يقدر يستخدم المنصة', 'Who can use it'),
      body: [
        tx('• لازم يكون عندك 21 سنة أو أكتر وأهلية قانونية كاملة.', '• You must be 21 or over with full legal capacity.'),
        tx('• البايع لازم يكون صاحب العقد، أو معاه توكيل رسمي ساري بيسمحله بالتنازل.', '• The seller must own the contract or hold a valid formal power of attorney allowing the transfer.'),
        tx('• السماسرة والوسطاء مش مسموحلهم يعرضوا وحدات.', '• Brokers and agents may not list units.'),
      ],
    },
    {
      id: 'seller',
      title: tx('التزامات البايع', "Seller's obligations"),
      body: [
        tx('• كل البيانات صحيحة: السعر، المدفوع، الأقساط، والمستندات.', '• All data is accurate: price, amount paid, installments and documents.'),
        tx('• يذكر أي أقساط متأخرة أو غرامات أو أي نزاع على الوحدة.', '• Declare any overdue installments, fines or disputes.'),
        tx('• المطلوب من المشتري هو اللي البايع دفعه بس (ناقص أي خصم يوافق عليه). ممنوع أي أوفر برايس.', '• The buyer is asked only for what the seller paid (less any agreed discount). No overprice.'),
        tx('• ما يبيعش الوحدة لحد تاني وهي في مرحلة اتفاق معانا من غير ما يبلّغنا.', '• Not sell the unit elsewhere during an agreement stage without telling us.'),
        tx('• يقدر يسحب إعلانه في أي وقت قبل توقيع التنازل من غير تكلفة.', '• May withdraw the listing any time before signing, free of charge.'),
      ],
    },
    {
      id: 'buyer',
      title: tx('التزامات المشتري', "Buyer's obligations"),
      body: [
        tx('• لما يتفق مع البايع، بيتكتب بينهم وعد بيع في مقر شركتنا، فيه كل البنود الخاصة بالوحدة والسعر.', '• Once buyer and seller agree, they sign a promise of sale at our office, with all unit terms and the price.'),
        tx(`• يدفع للبايع عربون ${BRAND.depositPercent}% من سعر الوحدة يوم وعد البيع، وشيك مصرفي بالمقدم ناقص العربون يوم التنازل في مقر المطور.`, `• Pay the seller a deposit of ${BRAND.depositPercent}% of the unit price on the day of the promise of sale, and a bank cheque for the down payment minus the deposit on transfer day at the developer.`),
        tx('• يكمّل الأقساط الباقية للمطور بنفس نظام العقد، أو زي ما المطور يحدد.', "• Continue the remaining installments per the contract or as the developer sets."),
        tx('• يتحمّل رسوم التنازل عند المطور، وقيمتها بتختلف حسب المطور.', "• Pay the developer's transfer fee; the amount differs by developer."),
        tx('• يقدر ينسحب في أي وقت قبل توقيع عقد وعد البيع.', '• May withdraw any time before signing the promise of sale.'),
        tx('• عدم تحويل أموال على حسابات شخصية مجهولة دون إيصالات وتوثيق.', '• Do not transfer money to personal accounts without official documentation.'),
      ],
    },
    {
      id: 'fees',
      title: tx('الرسوم', 'Fees'),
      body: [
        tx('• البايع: صفر عمولة.', '• Seller: zero fee.'),
        tx(`• المشتري: ${fee}% من سعر الوحدة (سعرها في العقد)، بتستحق بعد توقيع التنازل بس.`, `• Buyer: ${fee}% of the unit price (its contract price), due only after the transfer is signed.`),
        tx('• لو الصفقة ما تمّتش، المشتري ما بيدفعش حاجة لينا.', "• If the deal doesn't complete, the buyer owes us nothing."),
        tx('• رسوم المطور (زي رسوم التنازل) منفصلة عن رسومنا وبيدفعها المشتري، وقيمتها بتختلف حسب المطور.', "• Developer fees (such as the transfer fee) are separate from ours and paid by the buyer; the amount differs by developer."),
        tx('• ضريبة التصرفات العقارية على البايع، وهو اللي بيدفعها للمطور.', '• The real-estate disposal tax is on the seller, who pays it to the developer.'),
      ],
    },
    {
      id: 'circumvent',
      title: tx('التعامل من ورا المنصة', 'Going around the platform'),
      body: [
        tx(
          `لو المشتري اتعرّف على وحدة أو بايع عن طريقنا، وتمّت الصفقة بينهم مباشرة من غيرنا خلال 12 شهر، رسوم المشتري (${fee}% من سعر الوحدة) بتفضل مستحقة.`,
          `If a buyer was introduced to a unit or seller through us and they complete the deal directly within 12 months, the buyer fee (${fee}% of the unit price) remains due.`
        ),
      ],
    },
    {
      id: 'listings',
      title: tx('المراجعة والإعلانات', 'Review and listings'),
      body: [
        tx('• بنراجع العقد والمديونية قبل النشر على قد المستندات والمعلومات المتاحة لينا.', '• We check the contract and dues before listing, based on the documents and information available to us.'),
        tx('• المراجعة مش ضمان إن مفيش أي مشكلة؛ المطور هو المرجع النهائي.', '• Review is not a guarantee; the developer is the final reference.'),
        tx('• من حقنا نرفض أو نشيل أي إعلان فيه بيانات غلط أو مخالف للقواعد.', '• We may refuse or remove any listing with false data or that breaks the rules.'),
        tx('• الأرقام والتوفير المعروضين استرشاديين، والنهائي بيتحدد من العقد الفعلي.', '• Figures and savings shown are indicative; final numbers come from the actual contract.'),
      ],
    },
    {
      id: 'forbidden',
      title: tx('ممنوع', 'Prohibited'),
      body: [
        tx('• بيانات أو مستندات مزوّرة أو مش بتاعتك', "• Fake documents or data that isn't yours"),
        tx('• عرض وحدة بأوفر برايس', '• Listing a unit with an overprice'),
        tx('• انتحال صفة المنصة أو موظفيها', '• Impersonating the platform or its staff'),
        tx('• نسخ محتوى الموقع أو بياناته بشكل آلي', "• Automated copying of the site's content or data"),
        tx('المخالفة ممكن تؤدي لشيل الإعلان ووقف الحساب، واتخاذ الإجراءات القانونية لو لزم.', 'Violations may lead to removal, suspension and legal action where needed.'),
      ],
    },
    {
      id: 'liability',
      title: tx('حدود المسؤولية', 'Limitation of liability'),
      body: [
        tx(
          'احنا مسؤولين عن شغلنا في المراجعة والترتيب ببذل العناية المعقولة. مش مسؤولين عن: قرارات المطور، أو أي اتفاق أو دفع بيتم بين الطرفين برّه المنصة، أو أي بيانات غلط قدّمها أي طرف. في كل الأحوال، مسؤوليتنا ما تزيدش عن الرسوم اللي اتدفعت لينا في الصفقة دي.',
          "We are responsible for our review and coordination work with reasonable care. We are not liable for developer decisions, agreements or payments made outside the platform, or false data provided by either party. In any case our liability does not exceed the fees paid to us for that deal."
        ),
      ],
    },
    {
      id: 'ip',
      title: tx('الملكية الفكرية', 'Intellectual property'),
      body: [
        tx(`اسم "${name}" واللوجو وتصميم الموقع ومحتواه ملك المنصة. الصور والبيانات اللي بترفعها بتفضل ملكك، وبتدّينا إذن نستخدمها لعرض وحدتك بس.`, `The "${name}" name, logo, design and content belong to the platform. Photos and data you upload remain yours; you let us use them only to list your unit.`),
      ],
    },
    {
      id: 'law',
      title: tx('القانون والنزاعات', 'Law and disputes'),
      body: [
        tx(
          'الشروط دي خاضعة للقانون المصري. أي خلاف بنحاول نحلّه ودّياً الأول خلال 30 يوم، ولو ما اتحلّش بيكون من اختصاص محاكم القاهرة.',
          'These terms are governed by Egyptian law. We first try to settle any dispute amicably within 30 days; otherwise the Cairo courts have jurisdiction.'
        ),
      ],
    },
    {
      id: 'changes',
      title: tx('تعديل الشروط', 'Changes'),
      body: [
        tx(
          'ممكن نعدّل الشروط. التعديل مش بيأثر على صفقة اتوقّعت قبله. لو التعديل مهم هنبلّغك قبل ما يتطبّق، واستمرارك في استخدام المنصة بعدها معناه موافقتك.',
          "We may update these terms. Changes don't affect deals signed before them. We'll notify you of significant changes before they apply; continued use means acceptance."
        ),
      ],
    },
  ];

  return (
    <LegalPage
      title={tx('الشروط والأحكام', 'Terms & conditions')}
      updated={LEGAL_UPDATED}
      summaryTitle={tx('الخلاصة', 'In short')}
      summary={summary}
      sections={sections}
      footer={
        <button onClick={() => onNavigate('rules')} className="w-full flex items-center gap-3 rounded-xl border border-line p-5 text-start hover:border-brand transition-colors">
          <ScrollText className="w-6 h-6 text-brand shrink-0" />
          <span>
            <span className="block font-semibold text-ink">{tx('عاوز الكلام ده ببساطة؟', 'Want the plain version?')}</span>
            <span className="block text-sm text-muted">{tx('اقرا "القواعد" — نفس الفكرة في نقط قصيرة', 'Read "The rules" — same ideas in short points')}</span>
          </span>
        </button>
      }
    />
  );
};
