import { useEffect, useState, type FormEvent } from 'react';
import { sha256Hex } from '../../lib/sha256';
import LearnPage from './LearnPage';

const PASSWORD_HASH_KEY = 'climatePasswordHash_v1';
const LEARN_UNLOCKED_KEY = 'climateLearnUnlocked_v1';

export default function PasswordGate({
  onBack,
  onUnlocked,
}: {
  onBack: () => void;
  onUnlocked: () => void;
}) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(LEARN_UNLOCKED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const flag = localStorage.getItem(LEARN_UNLOCKED_KEY) === '1';
      setUnlocked(flag);
    } catch {
      setUnlocked(false);
    }
  }, []);

  const storedHash = (() => {
    try {
      return localStorage.getItem(PASSWORD_HASH_KEY);
    } catch {
      return null;
    }
  })();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!storedHash) {
      setError('Please sign up first to unlock this section.');
      return;
    }

    (async () => {
      const inputHash = await sha256Hex(password.trim());
      if (inputHash !== storedHash) {
        setError('Incorrect password. Try again.');
        return;
      }

      localStorage.setItem(LEARN_UNLOCKED_KEY, '1');
      setUnlocked(true);
      setPassword('');
      onUnlocked();
    })().catch(() => {
      setError('Could not verify the password. Try again.');
    });
  };

  if (unlocked) {
    return <LearnPage onBack={onBack} />;
  }

  return (
    <section className="section" style={{ minHeight: '100vh', paddingTop: 140, paddingBottom: 90, zIndex: 2, position: 'relative' }}>
      <div className="container">
        <h2 className="sectionTitle reveal">
          Enter <span className="gradientText">password</span>
        </h2>
        <p className="sectionLead reveal" style={{ marginBottom: 24 }}>
          This section is protected. Set during signup and stored only in your browser.
        </p>

        <div className="card reveal" style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(82,168,255,0.08))',
                border: '1px solid rgba(167,139,250,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {'\u{1F512}'}
            </div>
            <div className="cardTitle" style={{ fontSize: 18 }}>
              Unlock Learn + organizations
            </div>
          </div>

          <form onSubmit={onSubmit} className="field">
            <label htmlFor="unlock_password">Password</label>
            <input
              id="unlock_password"
              name="unlock_password"
              type="password"
              placeholder="Your signup password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
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

            <div className="btnRow" style={{ marginTop: 14 }}>
              <button type="submit" className="btn btnPrimary">
                Unlock
              </button>
              <button type="button" className="btn" onClick={onBack}>
                Back to start
              </button>
            </div>
          </form>

          <div className="hint" style={{ marginTop: 16, fontSize: 13 }}>
            If you forget it, re-sign up to set a new password.
          </div>
        </div>
      </div>
    </section>
  );
}
