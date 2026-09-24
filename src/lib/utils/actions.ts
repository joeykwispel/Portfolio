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

/** Button gently follows the cursor (desktop only). */
export const magnetic: Action<HTMLElement, number | undefined> = (node, strength = 0.25) => {
  if (!fine() || reduced()) return;
  const move = (e: PointerEvent) => {
    const r = node.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    node.style.translate = `${x * strength}px ${y * strength}px`;
  };
  const leave = () => (node.style.translate = '');
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerleave', leave);
  return {
    destroy() {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
    }
  };
};

/** Drag a chip around; it springs back on release. Suppresses the click if it was a drag. */
export const springDrag: Action<HTMLElement> = (node) => {
  let sx = 0;
  let sy = 0;
  let dragging = false;
  let moved = false;
  const down = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true;
    moved = false;
    sx = e.clientX;
    sy = e.clientY;
    node.setPointerCapture(e.pointerId);
    node.style.transition = 'none';
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (moved) node.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const up = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
    node.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.7, 0.5, 1)';
    node.style.transform = '';
  };
  const click = (e: MouseEvent) => {
    if (moved) {
      e.preventDefault();
      e.stopImmediatePropagation();
      moved = false;
    }
  };
  node.addEventListener('pointerdown', down);
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerup', up);
  node.addEventListener('pointercancel', up);
  node.addEventListener('click', click, true);
  return {
    destroy() {
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      node.removeEventListener('pointercancel', up);
      node.removeEventListener('click', click, true);
    }
  };
};

/** Counts a number up from 0 when visible. */
export const countUp: Action<HTMLElement, { to: number; decimals?: number; duration?: number }> = (node, opts) => {
  let current = opts;
  const render = (v: number) => (node.textContent = v.toFixed(current?.decimals ?? 0));
  render(reduced() ? current?.to ?? 0 : 0);
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
