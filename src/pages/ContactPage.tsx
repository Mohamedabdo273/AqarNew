import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { withBrand } from '../components/BrandWord';
import { BRAND, whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../types';
import { errorText, sendContact } from '../services/api';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  /** Called once the message is sent. */
  onSent: () => void;
}

type Topic = 'sell' | 'buy' | 'swap' | 'other';

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onSent }) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [topic, setTopic] = useState<Topic>('sell');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const phoneValid = /^01\d{9}$/.test(phone.replace(/\s/g, ''));
  const valid = name.trim().length > 1 && phoneValid && message.trim().length > 3;

  const topics: { id: Topic; l: string }[] = [
    { id: 'sell', l: tx('عندي وحدة', 'I have a unit') },
    { id: 'buy', l: tx('عايز أشتري', 'I want to buy') },
    { id: 'swap', l: tx('عايز أبدّل', 'I want to swap') },
    { id: 'other', l: tx('حاجة تانية', 'Something else') },
  ];

  const address = language === 'ar' ? BRAND.addressAr : BRAND.addressEn;
  const hours = language === 'ar' ? BRAND.hoursAr : BRAND.hoursEn;

  const channels = [
    { icon: Phone, t: tx('الخط الساخن', 'Hotline'), v: BRAND.hotline, href: `tel:${BRAND.hotline}`, ltr: true },
    { icon: MessageCircle, t: tx('واتساب', 'WhatsApp'), v: tx('بنرد في دقايق', 'We reply in minutes'), href: whatsappLink(tx('مرحباً، عندي سؤال', 'Hi, I have a question')), external: true },
    BRAND.email && { icon: Mail, t: tx('الإيميل', 'Email'), v: BRAND.email, href: `mailto:${BRAND.email}`, ltr: true },
  ].filter(Boolean) as { icon: React.ElementType; t: string; v: string; href: string; ltr?: boolean; external?: boolean }[];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!valid || sending) return;
    setSending(true);
    setSendError('');
    try {
      await sendContact({ topic, name: name.trim(), phone: phone.replace(/\s/g, ''), message: message.trim() });
      onSent();
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-wrap py-8 sm:py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-ink">{tx('كلمنا', 'Talk to us')}</h1>
        <p className="mt-3 text-lg text-ink-soft">{tx('بني آدم هيرد عليك، مش رد آلي.', "A real person will answer — not a bot.")}</p>
      </div>

      <div className="mt-8 sm:mt-10 grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-10 items-start">
        {/* Ways to reach us */}
        <div className="space-y-3">
          {channels.map((c) => (
            <a
              key={c.t}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="card p-5 flex items-center gap-4 hover:shadow-lift transition-shadow"
            >
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand text-white shrink-0">
                <c.icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-muted">{c.t}</p>
                <p className="font-display text-xl font-bold text-ink truncate" dir={c.ltr ? 'ltr' : undefined}>
                  {c.v}
                </p>
              </div>
            </a>
          ))}

          <div className="card p-5 space-y-4">
            {address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted">{tx('المكتب', 'Office')}</p>
                  <p className="font-semibold text-ink">{address}</p>
                </div>
              </div>
            )}
            {hours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-ink shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted">{tx('مواعيد الشغل', 'Working hours')}</p>
                  <p className="font-semibold text-ink">{hours}</p>
                </div>
              </div>
            )}
            <div className="pt-4 border-t border-line">
              <p className="text-sm text-muted">{tx('مين احنا', 'Who we are')}</p>
              <p className="mt-1 text-ink-soft leading-relaxed">
                {withBrand(tx(
                  `${BRAND.nameAr} منصة مصرية بتوصّل اللي عايز يخرج من وحدته باللي عايز يشتري بسعر زمان، أو يبدّل.`,
                  `${BRAND.nameEn} is an Egyptian platform connecting owners who want out with buyers at old prices — or swappers.`,
                ))}
              </p>
              <button type="button" onClick={() => onNavigate('about')} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:underline min-h-11">
                {tx('اعرف أكتر عننا', 'More about us')}
                <Arrow className="w-4 h-4" />
              </button>
            </div>
            {BRAND.mapUrl && (
              <a href={BRAND.mapUrl} target="_blank" rel="noreferrer" className="btn-ghost min-h-11 px-4 text-sm">
                <ExternalLink className="w-4 h-4" />
                {tx('افتح على الخريطة', 'Open in Maps')}
              </a>
            )}
          </div>
        </div>

        {/* Message form */}
        <form onSubmit={submit} noValidate className="card p-5 sm:p-8">
          <p className="font-display text-2xl font-bold text-ink">{tx('ابعتلنا رسالة', 'Send us a message')}</p>

          <div className="mt-6">
            <label htmlFor="c-topic" className="label">
              {tx('بخصوص إيه؟', "What's it about?")}
            </label>
            <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value as typeof topic)} className="field">
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.l}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-name" className="label">
                {tx('اسمك', 'Your name')}
              </label>
              <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
              {tried && name.trim().length < 2 && <p className="mt-1.5 text-sm text-danger">{tx('اكتب اسمك', 'Enter your name')}</p>}
            </div>
            <div>
              <label htmlFor="c-phone" className="label">
                {tx('موبايل (واتساب)', 'Mobile (WhatsApp)')}
              </label>
              <input
                id="c-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                autoComplete="tel"
                className={`field ${isRTL ? 'text-right' : 'text-left'}`}
              />
              {tried && !phoneValid && <p className="mt-1.5 text-sm text-danger">{tx('رقم موبايل مصري صحيح، 11 رقم', 'A valid 11-digit Egyptian mobile')}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="c-msg" className="label">
              {tx('رسالتك', 'Your message')}
            </label>
            <textarea
              id="c-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="field h-auto py-3 resize-y"
              placeholder={tx('مثلاً: عندي شقة في التجمع ودفعت مليون ونص، ينفع أبيعها؟', "e.g. I've paid 1.5M on a flat in New Cairo — can I sell it?")}
            />
            {tried && message.trim().length <= 3 && <p className="mt-1.5 text-sm text-danger">{tx('اكتب رسالتك', 'Write your message')}</p>}
          </div>

          <button type="submit" disabled={sending} className="btn-primary w-full mt-6 min-h-13">
            <Send className="w-5 h-5" />
            {sending ? tx('بنبعت...', 'Sending...') : tx('ابعت', 'Send')}
          </button>
          {sendError && <p role="alert" className="mt-3 text-sm text-danger">{sendError}</p>}
          <p className="mt-3 text-center text-xs text-muted">
            {tx('بالإرسال إنت موافق على ', 'By sending you agree to the ')}
            <button type="button" onClick={() => onNavigate('privacy')} className="font-semibold text-ink hover:underline">
              {tx('سياسة الخصوصية', 'Privacy policy')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
