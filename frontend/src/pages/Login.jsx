import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ orgName: '', email: '', password: '', role: 'NEW_ORG' });
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let response;
      const apiBase = 'http://localhost:5000/api';
      
      if (isRegister) {
        if (formData.role === 'INVITE') {
          response = await axios.post(`${apiBase}/invites/join`, {
            email: formData.email,
            password: formData.password,
            code: inviteCode
          });
        } else {
          response = await axios.post(`${apiBase}/auth/register`, {
            orgName: formData.orgName,
            email: formData.email,
            password: formData.password
          });
        }
      } else {
        response = await axios.post(`${apiBase}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
      }

      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <h1 className="text-gradient">WorkSync</h1>
          <p>{isRegister ? 'Create your organization or join one' : 'Sign in to your account'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="role-selector">
              <label>
                <input 
                  type="radio" 
                  checked={formData.role === 'NEW_ORG'} 
                  onChange={() => setFormData({...formData, role: 'NEW_ORG'})}
                /> Create Organization
              </label>
              <label>
                <input 
                  type="radio" 
                  checked={formData.role === 'INVITE'} 
                  onChange={() => setFormData({...formData, role: 'INVITE'})}
                /> Have Invite Code
              </label>
            </div>
          )}

          {isRegister && formData.role === 'NEW_ORG' && (
            <div className="form-group">
              <label>Organization Name</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={formData.orgName} 
                onChange={(e) => setFormData({...formData, orgName: e.target.value})}
              />
            </div>
          )}

          {isRegister && formData.role === 'INVITE' && (
            <div className="form-group">
              <label>Invite Code</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={inviteCode} 
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            {isRegister ? 'Get Started' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>
              {isRegister ? 'Sign In' : 'Register Here'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
