import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import BrihaspathiLogo from './BrihaspathiLogo';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('venu.m@brihaspathi.com');
  const [password, setPassword] = useState('Btl@1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate credentials
    if (email.trim().toLowerCase() === 'venu.m@brihaspathi.com' && password === 'Btl@1234') {
      onLogin({
        email: 'venu.m@brihaspathi.com',
        role: 'Product Development Team Lead',
        name: 'Venu M (Product Development)'
      });
    } else {
      setErrorMsg('Invalid Email ID or Password. Please enter correct credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0f19',
      backgroundImage: `
        radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.18) 0px, transparent 50%),
        radial-gradient(at 90% 90%, rgba(139, 92, 246, 0.18) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)
      `,
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Central Login Box */}
      <div className="card" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.2rem 2.5rem',
        background: 'rgba(18, 24, 38, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        borderRadius: '18px'
      }}>
        {/* Brand Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <BrihaspathiLogo height={54} showTagline={true} />
          </div>
        </div>

        {errorMsg && (
          <div style={{
            padding: '0.65rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px', color: '#fb7185', fontSize: '12px', marginBottom: '1.25rem', textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>Email ID *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="venu.m@brihaspathi.com"
                style={{ paddingLeft: '2.4rem', fontSize: '13px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600 }}>Password *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                style={{ paddingLeft: '2.4rem', fontSize: '13px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#6366f1' }}
              />
              Remember Login
            </label>

            <span style={{ color: '#818cf8', cursor: 'pointer' }} onClick={() => alert('Please contact system administrator to reset password.')}>
              Forgot Password?
            </span>
          </div>

          {/* Sign In Action Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', fontSize: '13.5px' }}
          >
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-muted)' }}>
          Brihaspathi Technologies &bull; Secure Portal v2.4
        </div>
      </div>
    </div>
  );
}
