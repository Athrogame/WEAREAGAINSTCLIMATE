import { useEffect, useMemo, useRef, useState } from 'react';
import ParticleField from './components/Background/ParticleField';
import Hero from './components/Hero/Hero';
import ScrollReveals from './components/Reveal/ScrollReveals';
import PledgeForm from './components/Signup/PledgeForm';
import PasswordGate from './components/Learn/PasswordGate';

const ACTIONS = [
  {
    title: 'Cut one high-impact habit',
    copy: 'Choose a lever you can actually keep. Small changes compound.',
    icon: '~',
  },
  {
    title: 'Switch to cleaner energy',
    copy: 'Support renewables and efficient heating/cooling.',
    icon: '+',
  },
  {
    title: 'Travel smarter',
    copy: 'Bundle trips, reduce flights, and choose low-carbon routes.',
    icon: '>',
  },
  {
    title: 'Speak up locally',
    copy: 'Back climate policy where you live. Community wins.',
    icon: '*',
  },
] as const;

const IMPACT_FOCUS = [
  {
    key: 'home',
    title: 'Home Emissions',
    copy: 'Lower heating/cooling demand and support efficient upgrades.',
    example: 'Example: tighten insulation + smart thermostat.',
  },
  {
    key: 'energy',
    title: 'Electricity',
    copy: 'Accelerate renewables and reduce waste in everyday power use.',
    example: 'Example: switch off standby + optimize usage hours.',
  },
  {
    key: 'transport',
    title: 'Transport',
    copy: 'Reduce car trips and make low-carbon travel the default.',
    example: 'Example: bike/walk/one fewer short drive per week.',
  },
] as const;

const NAV_ITEMS = [
  { label: 'Why', href: '#why' },
  { label: 'Actions', href: '#actions' },
  { label: 'Focus', href: '#impact' },
  { label: 'Pledge', href: '#pledge' },
] as const;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function App() {
  const [focusValue, setFocusValue] = useState(40);
  const [route, setRoute] = useState<'landing' | 'learn'>(() => {
    if (typeof window === 'undefined') return 'landing';
    return window.location.hash === '#learn' ? 'learn' : 'landing';
  });
  const [gateVersion, setGateVersion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash;
      if (h === '#learn') setRoute('learn');
      if (h === '' || h === '#start') setRoute('landing');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Scroll progress + floating nav visibility
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Show nav after scrolling past hero
      setNavVisible(scrollY > window.innerHeight * 0.6);

      // Detect active section
      const sections = ['why', 'actions', 'impact', 'pledge'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const focusIndex = useMemo(() => {
    if (focusValue < 33) return 0;
    if (focusValue < 66) return 1;
    return 2;
  }, [focusValue]);

  const activeFocus = IMPACT_FOCUS[focusIndex];

  const scrollToPledge = () => {
    const el = document.getElementById('pledge');
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  const goToLearn = () => {
    setRoute('learn');
    window.location.hash = '#learn';
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const goToLanding = () => {
    setRoute('landing');
    window.location.hash = '#start';
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className="appRoot">
      <ParticleField />
      <ScrollReveals routeKey={`${route}:${gateVersion}`} />

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scrollProgress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {route === 'landing' ? (
        <>
          {/* Floating navigation */}
          <nav className={`floatingNav ${navVisible ? 'visible' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`navLink ${activeSection === item.href.slice(1) ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Hero onCta={scrollToPledge} />

          <div className="sectionDivider" />

          <section id="why" className="section">
            <div className="container">
              <h2 className="sectionTitle reveal">
                Why it <span className="gradientText">matters</span>
              </h2>
              <p className="sectionLead reveal">
                Climate change isn't a distant headline. It's in the heat, the storms, and the choices we make today.
                Here's the pledge: it's local-first and purely front-end.
              </p>

              <div className="grid2" style={{ alignItems: 'start' }}>
                <div className="card reveal">
                  <div className="cardTitle" style={{ fontSize: 18, marginBottom: 10 }}>
                    The "momentum" effect
                  </div>
                  <div className="hint" style={{ marginBottom: 20 }}>
                    When people commit publicly (even locally), they follow through more often.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    <div className="statCard">
                      <div className="statNumber">
                        <span data-counter data-end="38" data-suffix="%" />
                      </div>
                      <div className="hint" style={{ marginTop: 4 }}>more consistent actions</div>
                    </div>
                    <div className="statCard">
                      <div className="statNumber">
                        <span data-counter data-end="12" data-suffix="x" />
                      </div>
                      <div className="hint" style={{ marginTop: 4 }}>better habit follow-through</div>
                    </div>
                    <div className="statCard">
                      <div className="statNumber">
                        <span data-counter data-end="50" data-suffix="%" />
                      </div>
                      <div className="hint" style={{ marginTop: 4 }}>community ripple potential</div>
                    </div>
                  </div>
                </div>

                <div className="card reveal">
                  <div className="cardTitle" style={{ fontSize: 18, marginBottom: 12 }}>
                    Local-first pledge
                  </div>
                  <div className="hint" style={{ marginBottom: 16 }}>
                    Submit once. The app stores your entry only in{' '}
                    <code style={{ color: 'var(--accent2)', background: 'rgba(82,168,255,0.08)', padding: '2px 6px', borderRadius: 6, fontSize: 13 }}>localStorage</code>.
                  </div>
                  <div className="btnRow">
                    <button type="button" className="btn btnPrimary" onClick={scrollToPledge}>
                      Make my pledge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="sectionDivider" />

          <section id="actions" className="section">
            <div className="container">
              <h2 className="sectionTitle reveal">
                What you can <span className="gradientText">do</span>
              </h2>
              <p className="sectionLead reveal">Pick one action you'll keep. The motion is real.</p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 18,
                }}
              >
                {ACTIONS.map((a) => (
                  <div
                    key={a.title}
                    className="card actionCard reveal"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, rgba(46,242,194,0.12), rgba(82,168,255,0.08))',
                          border: '1px solid rgba(46,242,194,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          fontWeight: 700,
                          color: 'var(--accent)',
                          flexShrink: 0,
                        }}
                      >
                        {a.icon}
                      </div>
                      <div className="cardTitle" style={{ fontSize: 17 }}>
                        {a.title}
                      </div>
                    </div>
                    <div className="hint">{a.copy}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="sectionDivider" />

          <section id="impact" className="section">
            <div className="container">
              <h2 className="sectionTitle reveal">
                Choose your <span className="gradientText">focus</span>
              </h2>
              <p className="sectionLead reveal">Slide to preview different pledge themes. Graphics update locally — no tracking.</p>

              <div className="grid2">
                <div className="card reveal">
                  <div className="cardTitle" style={{ fontSize: 18, marginBottom: 14 }}>
                    Focus: <span className="gradientText">{activeFocus.title}</span>
                  </div>
                  <div className="hint" style={{ marginBottom: 16 }}>
                    {activeFocus.copy}
                  </div>
                  <div className="hint" style={{ color: 'rgba(235,245,255,0.88)', marginBottom: 4 }}>
                    {activeFocus.example}
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={focusValue}
                      onChange={(e) => setFocusValue(Number(e.target.value))}
                      aria-label="Choose impact focus"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      {IMPACT_FOCUS.map((f, i) => (
                        <span
                          key={f.key}
                          className="hint"
                          style={{
                            fontSize: 12,
                            color: focusIndex === i ? 'var(--accent)' : undefined,
                            fontWeight: focusIndex === i ? 600 : 400,
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {f.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card reveal">
                  <div className="cardTitle" style={{ fontSize: 18, marginBottom: 10 }}>
                    Your pledge preview
                  </div>
                  <div className="hint" style={{ marginBottom: 16 }}>
                    We save your email with a timestamp locally when you submit.
                  </div>
                  <div
                    style={{
                      border: '1px solid var(--cardBorder)',
                      borderRadius: 16,
                      padding: 16,
                      background: 'rgba(8,10,20,0.4)',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>I will:</div>
                    <div className="hint">
                      Commit to one habit for <b style={{ color: 'var(--accent)' }}>30 days</b> and track it
                      weekly.
                    </div>
                  </div>
                  <div className="btnRow" style={{ marginTop: 16 }}>
                    <button type="button" className="btn btnPrimary" onClick={scrollToPledge}>
                      Pledge with this focus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="sectionDivider" />

          <section id="pledge" className="section">
            <div className="container">
              <h2 className="sectionTitle reveal">
                Join the <span className="gradientText">movement</span>
              </h2>
              <p className="sectionLead reveal">No backend. Your entry is saved to your browser's local storage.</p>

              <PledgeForm onSignedUp={() => goToLearn()} />
            </div>
          </section>

          <footer className="section footer" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div className="container">
              <div className="footerContent">
                <div className="hint" style={{ fontSize: 13 }}>
                  Built to run locally with system fonts, local assets, and generated motion graphics.
                </div>
                <div className="hint" style={{ fontSize: 13 }}>
                  Reduced-motion is respected automatically.
                </div>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <PasswordGate
          onBack={goToLanding}
          onUnlocked={() => {
            setGateVersion((v) => v + 1);
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
          }}
        />
      )}
    </div>
  );
}
