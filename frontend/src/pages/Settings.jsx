import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Copy, Users } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extra layer in case non-admins get here magically via URL
  if (user?.role !== 'ADMIN') {
    return (
      <div className="settings-container">
        <h1 className="page-title">Settings</h1>
        <div className="glass-panel error-panel">
          <p>Access Denied. Only Organization Administrators can view this page.</p>
        </div>
      </div>
    );
  }

  const handleGenerateInvite = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/invites/generate');
      setInviteCode(res.data.code);
    } catch (err) {
      console.error('Failed to generate invite', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      alert('Invite code copied to clipboard!');
    }
  };

  return (
    <div className="settings-container">
      <h1 className="page-title">Organization Settings</h1>

      <div className="settings-grid">
        <div className="glass-panel settings-card">
          <div className="settings-card-header">
            <Users size={24} color="var(--accent-primary)" />
            <h3>Team Management</h3>
          </div>
          
          <div className="settings-content">
            <p className="description">Generate an invite code to allow new members to seamlessly join your organization's workspace.</p>
            
            <button className="btn btn-primary" onClick={handleGenerateInvite} disabled={loading}>
              {loading ? 'Generating...' : 'Generate New Invite Code'}
            </button>

            {inviteCode && (
              <div className="invite-result animate-fade-in">
                <p>Share this code with your team member:</p>
                <div className="code-box">
                  <span className="code">{inviteCode}</span>
                  <button className="btn btn-secondary icon-btn" onClick={copyToClipboard} title="Copy to clipboard">
                    <Copy size={16} />
                  </button>
                </div>
                <small className="warning-text">This code will naturally expire in 7 days.</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
