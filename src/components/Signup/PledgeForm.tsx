import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { sha256Hex } from '../../lib/sha256';

type Pledge = {
  email: string;
  createdAt: number;
};

const STORAGE_KEY = 'climatePledges_v1';
const PASSWORD_HASH_KEY = 'climatePasswordHash_v1';
const LEARN_UNLOCKED_KEY = 'climateLearnUnlocked_v1';

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

export default function PledgeForm({ onSignedUp }: { onSignedUp: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [count, setCount] = useState<number>(0);

  const storedCountLabel = useMemo(() => {
    if (status === 'success') return 'Saved locally. Welcome in.';
    return 'Join and save locally in your browser.';
  }, [status]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setCount(0);
        return;
      }
      const parsed = JSON.parse(raw) as Pledge[];
      if (Array.isArray(parsed)) setCount(parsed.length);
    } catch {
      setCount(0);
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    (async () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Pledge[]) : [];
      const pledges: Pledge[] = Array.isArray(parsed) ? parsed : [];

      const trimmedEmail = email.trim();
      const next: Pledge = { email: trimmedEmail, createdAt: Date.now() };
      pledges.push(next);

      pledges.splice(0, Math.max(0, pledges.length - 50));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(pledges));

      const trimmedPassword = password.trim();
      const passwordHash = await sha256Hex(trimmedPassword);
      localStorage.setItem(PASSWORD_HASH_KEY, passwordHash);
      localStorage.setItem(LEARN_UNLOCKED_KEY, '1');

      setCount(pledges.length);
      setStatus('success');
      setEmail('');
      setPassword('');

      onSignedUp(trimmedEmail);
    })().catch(() => {
      setError('Could not save locally in this browser. Try again.');
    });
  };

  const lastSaved = status === 'success' ? 'Success' : 'Pledge';

  return (
    <div className="card reveal" style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: status === 'success'
              ? 'linear-gradient(135deg, rgba(46,242,194,0.2), rgba(46,242,194,0.08))'
              : 'linear-gradient(135deg, rgba(82,168,255,0.15), rgba(167,139,250,0.08))',
            border: `1px solid ${status === 'success' ? 'rgba(46,242,194,0.25)' : 'rgba(82,168,255,0.15)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            transition: 'all 0.5s ease',
            flexShrink: 0,
          }}
        >
          {status === 'success' ? '\u2713' : '\u2192'}
        </div>
        <div className="cardTitle" style={{ fontSize: 20 }}>
          {lastSaved}: climate pledge
        </div>
      </div>
      <div className="hint" style={{ marginBottom: 18 }}>
        {storedCountLabel}
        {count > 0 ? ` You're pledge #${count.toLocaleString()}.` : ''}
      </div>

      <form onSubmit={onSubmit} className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          disabled={status === 'success'}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          disabled={status === 'success'}
        />

        {error ? (
          <div style={{
            color: '#ff7b8a',
            fontSize: 14,
            marginTop: 4,
            padding: '8px 12px',
            borderRadius: 10,
            background: 'rgba(255,123,138,0.06)',
            border: '1px solid rgba(255,123,138,0.12)',
          }}>
            {error}
          </div>
        ) : null}

        <div className="btnRow" style={{ marginTop: 12 }}>
          <button type="submit" className="btn btnPrimary" disabled={status === 'success'}>
            {status === 'success' ? 'You\u2019re in' : 'Sign up'}
          </button>
          {status === 'success' ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStatus('idle');
                setError(null);
              }}
            >
              Add another
            </button>
          ) : null}
        </div>
      </form>

      <div className="hint" style={{ marginTop: 16, fontSize: 13 }}>
        Privacy: your entry is stored in <code style={{ color: 'var(--accent2)', background: 'rgba(82,168,255,0.08)', padding: '2px 6px', borderRadius: 6, fontSize: 12 }}>{STORAGE_KEY}</code> only.
      </div>
    </div>
  );
}
