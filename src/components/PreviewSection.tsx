import { Compass, LogIn } from 'lucide-react';
import { type Color } from '../utils/colorUtils';

interface PreviewSectionProps {
  colors: Color[];
}

export function PreviewSection({ colors }: PreviewSectionProps) {
  // Map first 6 colors, or fall back to safe defaults if count is smaller
  const cssVars = {
    '--preview-c1': colors[0]?.hex || '#6366f1',
    '--preview-c2': colors[1]?.hex || '#10b981',
    '--preview-c3': colors[2]?.hex || '#f59e0b',
    '--preview-c4': colors[3]?.hex || '#ef4444',
    '--preview-c5': colors[4]?.hex || '#8b5cf6',
    '--preview-c6': colors[5]?.hex || '#ec4899',
    // Text contrast guides (using lightness to estimate contrast text)
    '--preview-tx1': (colors[0]?.hsl.l || 50) > 60 ? '#0f172a' : '#ffffff',
    '--preview-tx2': (colors[1]?.hsl.l || 50) > 60 ? '#0f172a' : '#ffffff',
    '--preview-tx3': (colors[2]?.hsl.l || 50) > 60 ? '#0f172a' : '#ffffff',
    '--preview-tx4': (colors[3]?.hsl.l || 50) > 60 ? '#0f172a' : '#ffffff',
  } as React.CSSProperties;

  return (
    <div className="preview-section-card" style={cssVars}>
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-accent" />
          <h4>Live UI Preview</h4>
        </div>
      </div>

      <div className="card-body">
        {/* SINGLE EXQUISITE LOGIN PAGE PREVIEW */}
        <div className="mock-login-minimal">
          <div className="login-header">
            <h5>Welcome Back</h5>
            <p>Enter your credentials to access your secure portal.</p>
          </div>

          <div className="login-form-group">
            <div className="relative">
              <input
                type="email"
                className="login-input"
                placeholder="name@company.com"
                defaultValue="designer@prism.io"
                disabled
              />
            </div>
            <div className="relative">
              <input
                type="password"
                className="login-input"
                placeholder="••••••••••••"
                defaultValue="supersecret"
                disabled
              />
            </div>
          </div>

          <div className="login-actions-row">
            <label className="login-checkbox-label">
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--preview-c1)' }} disabled />
              <span>Remember device</span>
            </label>
            <span className="login-link">Forgot password?</span>
          </div>

          <button
            className="login-primary-btn"
            style={{ backgroundColor: 'var(--preview-c1)', color: 'var(--preview-tx1)' }}
          >
            <LogIn size={14} /> Sign In to Workspace
          </button>

          <div className="login-social-grid">
            <button className="login-social-btn">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--preview-c1)">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.377-2.87-6.377-6.39 0-3.51 2.868-6.39 6.377-6.39 1.625 0 3.097.615 4.24 1.62l3.058-3.06C19.387 2.505 16.035 1.2 12.24 1.2 6.22 1.2 1.2 6.2 1.2 12.2s5.02 11 11.04 11c6.51 0 10.823-4.59 10.823-11 0-.695-.06-1.39-.18-2.065H12.24z"/>
              </svg>
              <span>Google</span>
            </button>
            <button className="login-social-btn">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 1.2C5.4 1.2 0 6.6 0 13.2c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.3-.1-.3-.6-1.6.1-3.3 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 3 .1 3.3.8.9 1.3 2 1.3 3.3 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4C24 6.6 18.6 1.2 12 1.2z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
