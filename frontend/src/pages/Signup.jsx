import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, uploadGovId, verifyOtp } from '../api';

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
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

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
    
    setIsSubmitting(true);
    try {
      let govIdUrl = '';
      if (form.role === 'SELLER' && govIdFile) {
        const uploadResult = await uploadGovId(govIdFile);
        govIdUrl = uploadResult.govIdUrl;
      }

      const res = await signupUser({ ...form, govIdUrl });
      if (res.requiresOtp) {
        setRequiresOtp(true);
        setError('');
      } else {
        onSignup(res);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const user = await verifyOtp(form.email, otp);
      onSignup(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <h1 className="section-title">{requiresOtp ? 'Verify OTP' : 'Create Account'}</h1>
          
          {requiresOtp ? (
            <form onSubmit={handleOtpSubmit} className="auth-form">
              <p style={{ marginBottom: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                An OTP has been sent via SMS to <strong>{form.phone}</strong>. Please enter it below to verify your account.
              </p>
              <label className="auth-label">
                Enter 6-digit OTP
                <input
                  className="auth-input"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                />
              </label>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
          ) : (
            <>
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

                {error && <div className="auth-error">{error}</div>}
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </form>
              <div className="auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
