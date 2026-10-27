import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LegalPage, LegalSection } from '../components/LegalPage';
import { BRAND, LEGAL_UPDATED } from '../config/brand';

export const PrivacyPage: React.FC = () => {
  const { language, tx } = useLanguage();
  const name = language === 'ar' ? BRAND.nameAr : BRAND.nameEn;

  const summary = [
    tx('بناخد بس البيانات اللي محتاجينها عشان نبيع أو نشتري الوحدة', 'We only collect what we need to sell or buy the unit'),
    tx('رقمك ورقم وحدتك مش بيظهروا للمشترين', "Your phone and unit number aren't shown to buyers"),
    tx('مش بنبيع بياناتك لأي حد', 'We never sell your data'),
    tx('تقدر تطلب نسخة من بياناتك أو تمسحها في أي وقت', 'You can request a copy or deletion any time'),
  ];

  const sections: LegalSection[] = [
    {
      id: 'who',
      title: tx('مين احنا', 'Who we are'),
      body: [
        tx(
          `"${name}" منصة بتوصّل أصحاب وحدات التقسيط اللي عاوزين يخرجوا منها بمشترين عاوزين يشتروا بسعر العقد القديم. السياسة دي بتشرح إزاي بنتعامل مع بياناتك الشخصية، طبقاً لقانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020.`,
          `"${name}" connects owners who want to exit installment units with buyers who want the old contract price. This policy explains how we handle your personal data, in line with Egypt's Personal Data Protection Law No. 151 of 2020.`
        ),
      ],
    },
    {
      id: 'collect',
      title: tx('البيانات اللي بناخدها', 'What we collect'),
      body: [
        tx('لو بايع:', 'If you sell:'),
        tx('• اسمك زي العقد ورقم موبايلك', '• Your name as in the contract and your mobile number'),
        tx('• بيانات الوحدة: المطور، الكمبوند، المساحة، سعر العقد، المدفوع، الأقساط، والمديونية', '• Unit details: developer, compound, size, contract price, amount paid, installments, dues'),
        tx('• المستندات اللي بترفعها: العقد، كشف الحساب أو الإيصالات، والبطاقة', '• Documents you upload: contract, statement or receipts, national ID'),
        tx('لو مشتري:', 'If you buy:'),
        tx('• اسمك ورقم موبايلك لما تقولنا إنك مهتم بشراء وحدة', "• Your name and mobile when you tell us you're interested in buying a unit"),
        tx('• الميزانية والفلاتر اللي بتدوّر بيها (بتفضل على جهازك)', '• Budget and filters you search with (kept on your device)'),
        tx('من جهازك:', 'From your device:'),
        tx('• حاجات بسيطة بنحفظها على المتصفح عندك: اللغة، الوحدات المفضلة، طلباتك، والمسودات. دي مش بتتبعت لينا.', '• Small items stored in your browser: language, saved units, your requests and drafts. These are not sent to us.'),
      ],
    },
    {
      id: 'why',
      title: tx('بنستخدمها في إيه', 'Why we use it'),
      body: [
        tx('• نتأكد إنك المالك وإن العقد والمدفوعات صحيحة مع المطور', '• Confirm you own the unit and that the contract and payments are correct with the developer'),
        tx('• ننشر الوحدة للمشترين بعد المراجعة', '• List the unit to buyers after review'),
        tx('• نتابع طلبات الشراء ونتواصل معاك بالتليفون أو الواتساب', '• Follow up purchase interest and contact you by phone or WhatsApp'),
        tx('• نجهّز إجراءات التنازل في مقر المطور', '• Prepare the transfer at the developer'),
        tx('• نلتزم بأي طلب من جهة رسمية حسب القانون', '• Comply with lawful requests from authorities'),
        tx('مش بنستخدم بياناتك في إعلانات ولا بنبعتلك رسايل تسويق من غير موافقتك.', "We don't use your data for ads or send marketing without your consent."),
      ],
    },
    {
      id: 'share',
      title: tx('مين بيشوف بياناتك', 'Who sees your data'),
      body: [
        tx('• المشترين: بيشوفوا بيانات الوحدة والأرقام بس. اسمك ورقمك ورقم العمارة والشقة مش بيظهروا.', "• Buyers: see unit details and figures only — not your name, phone, or building/unit number."),
        tx('• المطور: بنشارك معاه اللي محتاجه للتأكد من العقد وعمل التنازل.', '• The developer: what is needed to verify the contract and process the transfer.'),
        tx('• الطرف التاني في الصفقة: بعد ما الطرفين يتفقوا، عشان يتقابلوا في مقر المطور.', '• The other party: once both sides agree, so you can meet at the developer.'),
        tx('• مقدمي خدمات بيشتغلوا معانا (زي الاستضافة والتخزين)، وملتزمين بنفس الحماية.', '• Service providers we use (like hosting and storage), bound to the same protection.'),
        tx('• جهات رسمية لو القانون طلب كده.', '• Authorities when required by law.'),
        tx('مش بنبيع ولا بنأجّر بياناتك لأي حد.', 'We never sell or rent your data.'),
      ],
    },
    {
      id: 'keep',
      title: tx('بنحتفظ بيها قد إيه', 'How long we keep it'),
      body: [
        tx(
          'بنحتفظ ببياناتك طول ما طلبك شغال، وبعد الصفقة للمدة اللي القانون بيطلبها للسجلات. لو سحبت طلبك قبل الصفقة، بنمسح المستندات خلال 30 يوم من طلبك.',
          'We keep your data while your request is active, and after a deal for as long as the law requires for records. If you withdraw before a deal, we delete your documents within 30 days of your request.'
        ),
      ],
    },
    {
      id: 'rights',
      title: tx('حقوقك', 'Your rights'),
      body: [
        tx('من حقك في أي وقت:', 'At any time you can:'),
        tx('• تعرف إيه البيانات اللي عندنا عنك وتاخد نسخة منها', '• Know what data we hold and get a copy'),
        tx('• تصحّح أي بيانات غلط', '• Correct anything wrong'),
        tx('• تطلب مسح بياناتك (إلا اللي القانون بيلزمنا نحتفظ بيه)', '• Ask us to delete your data (except what the law requires us to keep)'),
        tx('• تسحب موافقتك على التواصل', '• Withdraw your consent to be contacted'),
        tx('• تقدّم شكوى لمركز حماية البيانات الشخصية', '• Complain to the Personal Data Protection Center'),
        tx(`كلمنا على ${BRAND.hotline} أو واتساب وبنرد خلال 30 يوم بحد أقصى.`, `Contact us on ${BRAND.hotline} or WhatsApp; we reply within 30 days at most.`),
      ],
    },
    {
      id: 'security',
      title: tx('الحماية', 'Security'),
      body: [
        tx(
          'المستندات بتتخزن بشكل آمن، ومحدش بيشوفها غير فريق المراجعة. بنستخدم اتصال مشفّر، وبنراجع مين عنده صلاحية دورياً. ومع ذلك، مفيش نظام على الإنترنت آمن 100%، ولو حصل أي تسريب هنبلّغك وهنبلّغ الجهات المختصة زي ما القانون بيقول.',
          "Documents are stored securely and seen only by the review team. We use encrypted connections and regularly review who has access. No online system is 100% secure; if a breach happens we'll notify you and the authorities as the law requires."
        ),
      ],
    },
    {
      id: 'kids',
      title: tx('السن', 'Age'),
      body: [tx('المنصة للي عندهم 21 سنة أو أكتر. مش بنجمع بيانات أطفال عن قصد.', "The platform is for people aged 21 or over. We don't knowingly collect children's data.")],
    },
    {
      id: 'changes',
      title: tx('التعديلات', 'Changes'),
      body: [
        tx(
          'ممكن نعدّل السياسة دي. لو التعديل مهم، هنبلّغك على الموبايل أو في الموقع قبل ما يتطبّق. تاريخ آخر تحديث مكتوب فوق.',
          "We may update this policy. For significant changes we'll notify you by phone or on the site before they apply. The last-updated date is shown above."
        ),
      ],
    },
  ];

  return (
    <LegalPage
      title={tx('سياسة الخصوصية', 'Privacy policy')}
      updated={LEGAL_UPDATED}
      summaryTitle={tx('الخلاصة', 'In short')}
      summary={summary}
      sections={sections}
    />
  );
};
