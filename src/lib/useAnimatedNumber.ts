import { useEffect, useRef, useState } from 'react';

/**
 * Tweens a number to its new value (and up from 0 on first show), so money figures "count" instead of jumping.
 * Skips the animation for reduced-motion users and in background tabs, where it jumps straight to the value.
 */
export const useAnimatedNumber = (target: number, duration = 700) => {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    const begin = from.current;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = begin + (target - begin) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    // Whatever happens to the animation, land exactly on the target.
    const done = window.setTimeout(() => {
      from.current = target;
      setValue(target);
    }, duration + 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, [target, duration]);

  return value;
};
