import { useEffect } from 'react';

/** What fades in: page sections and unit cards. The first section (hero) is left alone so the page never opens blank. */
const TARGETS = 'main section:not(:first-child), main article';

/**
 * Sections and cards fade up as they scroll into view.
 * Hidden only by JS (so the page still shows everything if scripts fail), skipped for reduced-motion users,
 * and anything already on screen shows immediately.
 * Uses a scroll check rather than IntersectionObserver alone, so nothing can get stuck hidden.
 */
export const useScrollReveal = (key: unknown) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // No real viewport (hidden tab, prerender, preview thumbnail): show everything.
    if (window.innerHeight === 0) return;

    const inView = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };

    const prime = (el: Element) => {
      if (el.classList.contains('reveal') || inView(el)) return;
      el.classList.add('reveal');
    };

    const check = () => {
      document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => {
        if (inView(el)) el.classList.add('is-revealed');
      });
    };

    // Light throttle with a timer (not requestAnimationFrame, which pauses in background tabs and would leave things hidden).
    let timer = 0;
    const onScroll = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        check();
      }, 60);
    };

    const scan = () => {
      document.querySelectorAll(TARGETS).forEach(prime);
      check();
    };
    scan();
    // Cards appear later (filters, pagination) — watch for them too.
    const mo = new MutationObserver(scan);
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(timer);
      // Nothing stays hidden after leaving the page.
      document.querySelectorAll('.reveal').forEach((el) => el.classList.remove('reveal', 'is-revealed'));
    };
  }, [key]);
};
