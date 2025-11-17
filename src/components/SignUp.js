import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Leaf, BarChart3, Star, Circle } from 'lucide-react';
import './SignUp.css';

const SignUp = ({ onSignUp, onNavigateToLogin, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreeToTerms && onSignUp && !loading) {
      onSignUp(formData.email, formData.password, formData.fullName);
    }
  };

  const handleNavigateToLogin = (e) => {
    e.preventDefault();
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <div className="page-frame">
      <div className="signup-page">
      {/* Left Side - Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            {/* Brand Header */}
            <div className="brand-header">
              <div className="brand-icon">
                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.80116 8.18487C8.90741 6.30252 10.5826 4.52847 12.7011 2.96447L12.9249 2.96296L14.7651 2.96191M10.3136 3.29017C10.4956 3.25334 10.6791 3.21992 10.864 3.18997C15.7577 5.2549 19.5496 8.21828 21.5327 11.5184M18.2471 2.96191L19.0816 2.96283C19.5229 2.96283 19.9598 2.98311 20.3907 3.02278C22.4719 4.57311 24.1188 6.3262 25.211 8.18487M12.0843 11.5184C14.0252 8.29947 17.6987 5.40199 22.4408 3.35035C22.6498 3.39431 22.8566 3.44329 23.0613 3.49663M31.1763 12.0872L31.569 13.6057C32.4101 16.8584 30.455 20.177 27.2024 21.0181C26.705 21.1467 26.1934 21.2117 25.6796 21.2117L6.92057 21.2122C3.56091 21.2122 0.837219 18.4888 0.837219 15.1292C0.837219 14.6154 0.902295 14.1036 1.03092 13.6061L1.4235 12.0879C2.81254 6.71594 7.65883 2.9633 13.2075 2.96301H19.3926C24.9411 2.96301 29.7874 6.71535 31.1763 12.0872Z" fill="white"/>
                </svg>
              </div>
              <h1 className="brand-title">Shelvy</h1>
              <p className="brand-description">Smart bread freshness monitoring for modern bakeries</p>
            </div>

            {/* Features */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Leaf size={18} />
                </div>
                <span>Real-time freshness tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Sparkles size={18} />
                </div>
                <span>Reduce waste by 40%</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <BarChart3 size={16} />
                </div>
                <span>Analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="form-section">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Join the bakery!</h2>
            <p className="form-subtitle">Start monitoring your bread quality today</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="form-field">
              <label className="field-label">👤 Full Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-field">
              <label className="field-label">📧 Email Address</label>
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label className="field-label">🔒 Password</label>
              <div className="input-container password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input password-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="terms-container">
              <div className="checkbox-container">
                <button
                  type="button"
                  className={`custom-checkbox ${agreeToTerms ? 'checked' : ''}`}
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                >
                  {agreeToTerms && <div className="checkbox-indicator"></div>}
                </button>
                <div className="terms-text">
                  <p className="terms-line">
                    📋 By joining our bakery family, I agree to the
                  </p>
                  <p className="terms-links">
                    <a href="#" className="terms-link">Terms of Service</a>
                    <span className="terms-and"> and </span>
                    <a href="#" className="terms-link">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-button ${agreeToTerms ? 'enabled' : 'disabled'}`}
              disabled={!agreeToTerms || loading}
            >
              {loading ? 'Creating account…' : '✨ Sign Up'}
            </button>

            {/* Divider */}
            <div className="form-divider">
              <span>or</span>
            </div>

            {/* Sign In Link */}
            <div className="signin-link-container">
              <p className="signin-text">
                Already part of the bakery?{' '}
                <a href="#" className="signin-link" onClick={handleNavigateToLogin}>Sign in here</a>
              </p>
            </div>
            {error && <div className="auth-inline-error">{error}</div>}
          </form>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <Star className="decorative-star star-1" size={24} />
        <Circle className="decorative-circle circle-1" size={16} />
        <Star className="decorative-star star-2" size={20} />
      </div>
      </div>
    </div>
  );
};

export default SignUp;
