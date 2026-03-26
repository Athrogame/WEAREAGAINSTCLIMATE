import { useEffect, useMemo, useState, type FormEvent } from 'react';

type Org = { name: string; url: string; blurb: string };

const DONATIONS_KEY = 'climateDonations_v1';

const ORGS: Org[] = [
  {
    name: '350.org',
    url: 'https://350.org/',
    blurb: 'Climate action and campaigns aimed at keeping fossil fuels in the ground.',
  },
  {
    name: 'The Nature Conservancy',
    url: 'https://www.nature.org/',
    blurb: 'Protects lands and waters to build resilience and safeguard biodiversity.',
  },
  {
    name: 'World Wildlife Fund (WWF)',
    url: 'https://www.worldwildlife.org/',
    blurb: 'Conservation work to protect ecosystems and reduce human impact.',
  },
  {
    name: 'Environmental Defense Fund (EDF)',
    url: 'https://www.edf.org/',
    blurb: 'Science-backed solutions to tackle climate and other environmental challenges.',
  },
];

type Donation = {
  orgName: string;
  amount: number;
  frequency: 'one-time' | 'monthly';
  createdAt: number;
};

function safeParseDonations(raw: string | null): Donation[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Donation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function FakeDonate() {
  const [orgName, setOrgName] = useState(ORGS[0]!.name);
  const [amount, setAmount] = useState(25);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [note, setNote] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');
  const [donationsCount, setDonationsCount] = useState(0);

  useEffect(() => {
    const pledges = safeParseDonations(localStorage.getItem(DONATIONS_KEY));
    setDonationsCount(pledges.length);
  }, []);

  const org = useMemo(() => ORGS.find((o) => o.name === orgName) ?? ORGS[0]!, [orgName]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const amt = Math.round(Number(amount));
    if (!Number.isFinite(amt) || amt <= 0) {
      setError('Choose a donation amount greater than 0.');
      return;
    }

    try {
      const existing = safeParseDonations(localStorage.getItem(DONATIONS_KEY));
      const next: Donation = { orgName, amount: amt, frequency, createdAt: Date.now() };
      existing.push(next);
      existing.splice(0, Math.max(0, existing.length - 100));
      localStorage.setItem(DONATIONS_KEY, JSON.stringify(existing));

      setDonationsCount(existing.length);
      setStatus('saved');
      setNote('');
    } catch {
      setError('Could not record your simulated donation in this browser.');
    }
  };

  const headline = status === 'saved' ? 'Donation recorded locally' : 'Simulate a donation (local-only)';

  return (
    <div className="card reveal">
      <div className="cardTitle" style={{ fontSize: 18, marginBottom: 8 }}>
        {headline}
      </div>
      <div className="hint" style={{ marginBottom: 14 }}>
        This captures your intent in your browser so you can see the flow. No payment is processed.
      </div>

      <div style={{ marginBottom: 14 }}>
        <div className="hint" style={{ marginBottom: 6 }}>
          Organization
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            aria-label="Select organization"
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(120,160,255,0.25)',
              background: 'rgba(8,10,20,0.55)',
              color: 'var(--text)',
              outline: 'none',
            }}
          >
            {ORGS.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
          <a className="btn" href={org.url} target="_blank" rel="noreferrer" style={{ whiteSpace: 'nowrap' }}>
            Visit
          </a>
        </div>
        <div className="hint" style={{ marginTop: 8 }}>
          {org.blurb}
        </div>
      </div>

      <form onSubmit={onSubmit} className="field">
        <div className="grid2" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="hint" style={{ marginBottom: 6 }}>
              Amount ($)
            </div>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-label="Donation amount"
              style={{ width: '100%' }}
              disabled={status === 'saved'}
            />
            <div style={{ fontWeight: 800, marginTop: 6, fontSize: 22, letterSpacing: '-0.02em' }}>
              ${amount}
            </div>
          </div>

          <div>
            <div className="hint" style={{ marginBottom: 6 }}>
              Frequency
            </div>
            <div className="btnRow">
              <button
                type="button"
                className={`btn ${frequency === 'one-time' ? 'btnPrimary' : ''}`}
                onClick={() => setFrequency('one-time')}
                disabled={status === 'saved'}
              >
                One-time
              </button>
              <button
                type="button"
                className={`btn ${frequency === 'monthly' ? 'btnPrimary' : ''}`}
                onClick={() => setFrequency('monthly')}
                disabled={status === 'saved'}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="note">Optional message</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., For safer communities and cooler futures."
            disabled={status === 'saved'}
            style={{
              width: '100%',
              minHeight: 92,
              resize: 'vertical',
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid rgba(120,160,255,0.25)',
              background: 'rgba(8,10,20,0.55)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <div className="hint">
            Saved locally only if you submit. This prototype doesn’t send anything.
          </div>
        </div>

        {error ? (
          <div style={{ color: '#ff7b8a', fontSize: 14, marginTop: 2 }}>{error}</div>
        ) : null}

        <div className="btnRow" style={{ marginTop: 10 }}>
          <button type="submit" className="btn btnPrimary" disabled={status === 'saved'}>
            {status === 'saved' ? 'Recorded' : 'Simulate donation'}
          </button>
          {status === 'saved' ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStatus('idle');
                setError(null);
              }}
            >
              Record another
            </button>
          ) : null}
        </div>
      </form>

      <div className="hint" style={{ marginTop: 14 }}>
        You’ve recorded {donationsCount.toLocaleString()} simulated donation{donationsCount === 1 ? '' : 's'} in this browser.
      </div>
    </div>
  );
}

