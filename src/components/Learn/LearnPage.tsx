import FakeDonate from './FakeDonate';

export default function LearnPage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      <div className="container" style={{ paddingTop: 110, paddingBottom: 30 }}>
        <div className="btnRow" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="btn" onClick={onBack}>
            Back to start
          </button>
          <a className="btn btnPrimary" href="#organizations">
            Organizations
          </a>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle reveal">
            What climate change <span className="gradientText">is</span>
          </h2>
          <p className="sectionLead reveal">
            Climate change is the long-term shift in weather patterns caused largely by greenhouse gases. When
            those gases build up, the Earth holds on to more heat — warming the atmosphere and oceans, changing rainfall,
            and increasing the odds of extreme events.
          </p>

          <div className="grid2" style={{ alignItems: 'start' }}>
            <div className="card reveal">
              <div className="cardTitle" style={{ fontSize: 18, marginBottom: 12 }}>
                Why it's happening
              </div>
              <div className="hint" style={{ marginBottom: 14 }}>
                Most of today's warming comes from human activities that add greenhouse gases like carbon dioxide and
                methane: burning coal, oil, and gas; clearing forests; and some agricultural practices.
              </div>
              <div className="hint" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                The good news: choices today can reduce emissions and build resilience for tomorrow.
              </div>
            </div>

            <div className="card reveal">
              <div className="cardTitle" style={{ fontSize: 18, marginBottom: 12 }}>
                What you can do
              </div>
              <div className="hint" style={{ marginBottom: 14 }}>
                Pick actions that are easy to start and hard to abandon.
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  '1. Reduce high-impact habits (energy, food, travel)',
                  '2. Support cleaner systems (renewables, efficient homes)',
                  '3. Join local advocacy and community projects',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--cardBorder)',
                      background: 'rgba(8,10,20,0.3)',
                      transition: 'border-color 0.3s ease',
                    }}
                  >
                    <div className="hint">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sectionDivider" />

      <section id="actions" className="section">
        <div className="container">
          <h2 className="sectionTitle reveal">
            What we can do to <span className="gradientText">stop it</span>
          </h2>
          <p className="sectionLead reveal">
            Real change is a mix of personal habits, community action, and policy. Start small, stay consistent, and scale up.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              {
                title: 'Cut emissions',
                copy: 'Use less energy where you can, and choose cleaner options when you can\u2019t.',
              },
              {
                title: 'Protect nature',
                copy: 'Healthy ecosystems absorb carbon and protect communities from heat and floods.',
              },
              {
                title: 'Back solutions',
                copy: 'Support the people and policies building durable climate resilience.',
              },
            ].map((c) => (
              <div key={c.title} className="card actionCard reveal">
                <div className="cardTitle" style={{ fontSize: 18, marginBottom: 8 }}>
                  {c.title}
                </div>
                <div className="hint">{c.copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sectionDivider" />

      <section id="organizations" className="section">
        <div className="container">
          <h2 className="sectionTitle reveal">
            Organizations to <span className="gradientText">help</span>
          </h2>
          <p className="sectionLead reveal">
            These groups work on climate action and conservation. Pick one that matches your interests and time.
          </p>

          <div className="grid2" style={{ alignItems: 'start' }}>
            <div className="card reveal">
              <div className="cardTitle" style={{ fontSize: 18, marginBottom: 14 }}>
                Quick picks
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  {
                    name: '350.org',
                    url: 'https://350.org/',
                    blurb: 'Campaigns and action for a livable future.',
                  },
                  {
                    name: 'The Nature Conservancy',
                    url: 'https://www.nature.org/',
                    blurb: 'Protecting lands and waters to strengthen resilience.',
                  },
                  {
                    name: 'WWF',
                    url: 'https://www.worldwildlife.org/',
                    blurb: 'Conservation efforts that reduce climate pressure.',
                  },
                  {
                    name: 'Environmental Defense Fund (EDF)',
                    url: 'https://www.edf.org/',
                    blurb: 'Science-backed solutions for climate and environment.',
                  },
                ].map((o) => (
                  <div
                    key={o.name}
                    className="statCard reveal"
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{o.name}</div>
                    <div className="hint" style={{ marginBottom: 10 }}>
                      {o.blurb}
                    </div>
                    <a className="btn btnPrimary" href={o.url} target="_blank" rel="noreferrer" style={{ width: 'fit-content', padding: '8px 16px', fontSize: 13 }}>
                      Learn more
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <FakeDonate />
          </div>
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
    </div>
  );
}
