import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { loginUser } from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz23456789'; // Avoid ambiguous chars like O, 0, I, l
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    // CAPTCHA Validation
    if (captchaInput !== captchaCode) {
      setError('Invalid CAPTCHA code. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser(email, password);
      onLogin(res);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="auth-card">
          <h1 className="section-title">Login</h1>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="auth-label">
              Password
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {/* Visual CAPTCHA Box */}
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <span className="auth-label" style={{ marginBottom: '8px' }}>Security Check</span>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  letterSpacing: '5px',
                  color: '#1e293b',
                  userSelect: 'none',
                  textDecoration: 'line-through',
                  fontStyle: 'italic',
                  fontFamily: 'monospace',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                }}>
                  {captchaCode}
                </div>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="btn btn-outline"
                  style={{ padding: '12px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Generate New CAPTCHA"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
              <input
                className="auth-input"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA code"
                style={{ width: '100%' }}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
