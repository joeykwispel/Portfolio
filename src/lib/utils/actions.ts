import type { Action } from 'svelte/action';

const fine = () => typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `in` class once the element scrolls into view (used for reveal animations). */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, opts) => {
  node.classList.add('reveal');
  if (opts?.delay) node.style.transitionDelay = `${opts.delay}ms`;
  if (typeof IntersectionObserver === 'undefined') {
    node.classList.add('in');
    return;
  }
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        node.classList.add('in');
        io.disconnect();
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
};

/** Calls `cb(true)` when the element enters the viewport (once). */
export const inView: Action<HTMLElement, (v: boolean) => void> = (node, cb) => {
  if (typeof IntersectionObserver === 'undefined') {
    cb?.(true);
    return;
  }
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        cb?.(true);
        io.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
};

/** 3D tilt on pointer move (desktop only). */
export const tilt: Action<HTMLElement, number | undefined> = (node, max = 8) => {
  if (!fine() || reduced()) return;
  let raf = 0;
  const move = (e: PointerEvent) => {
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      node.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
      node.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
      node.style.setProperty('--my', `${(py + 0.5) * 100}%`);
    });
  };
  const leave = () => {
    cancelAnimationFrame(raf);
    node.style.transform = '';
  };
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', leave);
  return {
    destroy() {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
    }
  };
};

/** Counts a number up from 0 when visible. */
export const countUp: Action<HTMLElement, { to: number; decimals?: number; duration?: number }> = (node, opts) => {
  let current = opts;
  const render = (v: number) => (node.textContent = v.toFixed(current?.decimals ?? 0));
  render(reduced() ? (current?.to ?? 0) : 0);
  const run = () => {
    if (reduced() || !current) return render(current?.to ?? 0);
    const start = performance.now();
    const dur = current.duration ?? 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      render(current!.to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      io.disconnect();
      run();
    }
  });
  io.observe(node);
  return {
    update(o) {
      current = o;
    },
    destroy: () => io.disconnect()
  };
};
