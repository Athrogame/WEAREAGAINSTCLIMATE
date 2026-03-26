import { useEffect, useRef } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function SplitText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <span className={className} style={{ ...style, perspective: '600px', display: 'inline' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          <span className="word" style={{ animationDelay: `${delay + i * 0.13}s` }}>
            {word}
          </span>
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/* Generative aurora wave canvas — purely CSS + requestAnimationFrame */
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Aurora wave parameters
    const waves = [
      { color: [46, 242, 194], yBase: 0.55, amp: 0.09, freq: 0.0014, speed: 0.00035, phase: 0, opacity: 0.18, thickness: 0.22 },
      { color: [82, 168, 255], yBase: 0.48, amp: 0.07, freq: 0.0018, speed: 0.00028, phase: 1.2, opacity: 0.14, thickness: 0.18 },
      { color: [167, 139, 250], yBase: 0.60, amp: 0.06, freq: 0.0022, speed: 0.00022, phase: 2.5, opacity: 0.12, thickness: 0.15 },
      { color: [46, 242, 194], yBase: 0.38, amp: 0.05, freq: 0.0016, speed: 0.00040, phase: 3.8, opacity: 0.08, thickness: 0.12 },
      { color: [82, 168, 255], yBase: 0.68, amp: 0.08, freq: 0.0012, speed: 0.00020, phase: 0.7, opacity: 0.10, thickness: 0.20 },
    ];

    let t = 0;

    const drawFrame = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      for (const wave of waves) {
        const [r, g, b] = wave.color;
        const cy = wave.yBase * h;
        const amp = wave.amp * h;
        const thick = wave.thickness * h;

        ctx.beginPath();

        // Draw the wave path
        for (let x = 0; x <= w; x += 2) {
          const y = cy +
            Math.sin(x * wave.freq + t * wave.speed * 1000 + wave.phase) * amp +
            Math.sin(x * wave.freq * 1.7 + t * wave.speed * 800 + wave.phase + 1) * amp * 0.4;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Close to bottom and fill with gradient fade
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, cy - amp - thick, 0, cy + amp + thick * 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${wave.opacity})`);
        grad.addColorStop(0.65, `rgba(${r},${g},${b},${wave.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.fill();

        // Draw a bright edge line on top of the wave
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = cy +
            Math.sin(x * wave.freq + t * wave.speed * 1000 + wave.phase) * amp +
            Math.sin(x * wave.freq * 1.7 + t * wave.speed * 800 + wave.phase + 1) * amp * 0.4;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
        lineGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        lineGrad.addColorStop(0.2, `rgba(${r},${g},${b},${wave.opacity * 1.8})`);
        lineGrad.addColorStop(0.5, `rgba(${r},${g},${b},${wave.opacity * 2.2})`);
        lineGrad.addColorStop(0.8, `rgba(${r},${g},${b},${wave.opacity * 1.8})`);
        lineGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      t += 1;
    };

    if (reduced) {
      drawFrame();
    } else {
      const animate = () => {
        if (!running) return;
        drawFrame();
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  );
}

export default function Hero({ onCta }: { onCta: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const inner = section.querySelector('.heroInner') as HTMLElement | null;
      if (inner) {
        inner.style.transform = `translate3d(0, ${scrollY * 0.28}px, 0)`;
        inner.style.opacity = `${Math.max(0, 1 - scrollY / 650)}`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero"
      aria-label="Climate movement landing hero"
      style={{ position: 'relative', minHeight: '100vh', padding: '150px 20px 120px', overflow: 'hidden' }}
    >
      {/* Deep space base gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(6, 10, 22, 0.0), var(--bg0) 70%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Generative aurora waves */}
      <AuroraCanvas />

      {/* Atmospheric color halos */}
      <div
        aria-hidden="true"
        className="heroAtmo"
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 80% 50% at 15% 40%, rgba(46, 242, 194, 0.07), transparent 60%)',
            'radial-gradient(ellipse 70% 45% at 85% 30%, rgba(82, 168, 255, 0.06), transparent 55%)',
            'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(167, 139, 250, 0.05), transparent 55%)',
          ].join(', '),
          animation: 'atmoBreath 10s ease-in-out infinite alternate',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade to content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, transparent, var(--bg0))',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Floating orbs */}
      <div className="floatingOrb orb1" aria-hidden="true" style={{ zIndex: 1 }} />
      <div className="floatingOrb orb2" aria-hidden="true" style={{ zIndex: 1 }} />
      <div className="floatingOrb orb3" aria-hidden="true" style={{ zIndex: 1 }} />

      <div className="container heroInner" style={{ position: 'relative', zIndex: 3 }}>
        {/* Live badge */}
        <div className="btnRow" style={{ marginBottom: 28 }}>
          <span
            className="heroBadge shimmer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px 8px 10px',
              borderRadius: 999,
              border: '1px solid rgba(46, 242, 194, 0.18)',
              background: 'rgba(10, 14, 28, 0.55)',
              backdropFilter: 'blur(12px)',
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(235, 245, 255, 0.85)',
              letterSpacing: '0.01em',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'relative',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
                display: 'inline-block',
                flexShrink: 0,
                animation: 'badgePulse 2s ease-in-out infinite',
              }}
            />
            Climate, but make it unstoppable.
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="heroTitle"
          style={{
            fontSize: 'clamp(42px, 6vw, 88px)',
            lineHeight: 1.0,
            margin: '0 0 8px',
            letterSpacing: '-0.048em',
            fontWeight: 760,
          }}
        >
          <SplitText text="Every degree" delay={0.2} />
          <br />
          <SplitText
            text="is a decision."
            className="gradientText"
            style={{ display: 'inline' }}
            delay={0.55}
          />
        </h1>

        {/* Subheading */}
        <p
          className="sectionLead reveal"
          style={{
            marginTop: 24,
            fontSize: 'clamp(16px, 1.65vw, 20px)',
            maxWidth: 620,
            lineHeight: 1.65,
            opacity: 0.88,
          }}
        >
          A local-first climate pledge. Cut your footprint, track your actions,
          support what matters — all in your own browser.
        </p>

        {/* CTAs */}
        <div className="btnRow reveal" style={{ marginTop: 34, gap: 14 }}>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={onCta}
            style={{ padding: '15px 32px', fontSize: 15, fontWeight: 600 }}
          >
            Join the movement
          </button>
          <a
            className="btn"
            href="#why"
            style={{ padding: '15px 26px', fontSize: 15 }}
          >
            See why it matters
          </a>
        </div>

        {/* Trust line */}
        <div
          className="reveal"
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          {[
            'No accounts',
            'No tracking',
            'No servers',
          ].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'rgba(186, 201, 232, 0.55)',
              }}
            >
              <span style={{ color: 'var(--accent)', fontSize: 11 }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
