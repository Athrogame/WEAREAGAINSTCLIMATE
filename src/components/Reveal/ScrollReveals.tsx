import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function ScrollReveals({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    const reduced = usePrefersReducedMotion();
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Reveal animations with staggered cascade ──
      const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'));

      sections.forEach((section) => {
        const revealEls = Array.from(section.querySelectorAll<HTMLElement>('.reveal'));

        revealEls.forEach((el, idx) => {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 40,
              filter: 'blur(10px)',
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              duration: 1.0,
              ease: 'power3.out',
              delay: Math.min(idx * 0.08, 0.4),
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      });

      // ── Counter animations with eased counting ──
      const counterEls = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]'));

      counterEls.forEach((el) => {
        const end = Number(el.dataset.end ?? 0);
        const suffix = el.dataset.suffix ?? '';
        if (!Number.isFinite(end) || end === 0) return;

        const obj = { value: 0 };
        gsap.fromTo(
          obj,
          { value: 0 },
          {
            value: end,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
              const rounded = Math.round(obj.value);
              el.textContent = `${rounded.toLocaleString()}${suffix}`;
            },
          },
        );
      });

      // ── Parallax for section titles ──
      const titles = Array.from(document.querySelectorAll<HTMLElement>('.sectionTitle'));
      titles.forEach((title) => {
        gsap.fromTo(
          title,
          { y: 0 },
          {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: title,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          },
        );
      });

      // ── Card 3D tilt on scroll ──
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.card'));
      cards.forEach((card) => {
        // Mouse-driven 3D tilt
        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 6,
            rotateX: -y * 6,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });

      // ── Staggered grid items ──
      const grids = Array.from(document.querySelectorAll<HTMLElement>('.grid2, [style*="gridTemplateColumns"]'));
      grids.forEach((grid) => {
        const children = Array.from(grid.children) as HTMLElement[];
        children.forEach((child, i) => {
          gsap.fromTo(
            child,
            { opacity: 0, y: 30, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              delay: i * 0.12,
              scrollTrigger: {
                trigger: child,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      });
    });

    const timeout = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(timeout);
      ctx.revert();
    };
  }, [routeKey]);

  return null;
}
