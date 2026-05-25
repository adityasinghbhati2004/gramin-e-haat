import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { signupUser, uploadGovId } from '../api';

const Signup = ({ onSignup }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'BUYER'
  });
  const [govIdFile, setGovIdFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz23456789'; // Avoid ambiguous characters
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setGovIdFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    if (form.role === 'SELLER' && !govIdFile) {
      setError('Please upload a Government ID (Aadhaar/PAN) for artisan verification.');
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
      let govIdUrl = '';
      if (form.role === 'SELLER' && govIdFile) {
        const uploadResult = await uploadGovId(govIdFile);
        govIdUrl = uploadResult.govIdUrl;
      }

      const res = await signupUser({ ...form, govIdUrl });
      onSignup(res);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
      generateCaptcha();
      setCaptchaInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <h1 className="section-title">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label">
              I am a...
              <select className="auth-input" name="role" value={form.role} onChange={handleChange}>
                <option value="BUYER">Customer</option>
                <option value="SELLER">Artisan / Seller</option>
              </select>
            </label>
            <label className="auth-label">
              Full Name
              <input
                className="auth-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="auth-label">
              Password
              <input
                className="auth-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            <label className="auth-label">
              Phone
              <input
                className="auth-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                pattern="\d{10}"
                maxLength={10}
                required
              />
            </label>
            <label className="auth-label">
              Address
              <input
                className="auth-input"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>
            
            {form.role === 'SELLER' && (
              <div style={{ background: 'var(--surface-color)', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Artisan Verification</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '10px' }}>
                  Please upload a valid Government ID (Aadhaar/Voter ID) to verify your artisan account.
                </p>
                <label className="auth-label" style={{ marginBottom: 0 }}>
                  Upload Document
                  <input
                    className="auth-input"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    required={form.role === 'SELLER'}
                  />
                </label>
              </div>
            )}

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
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
