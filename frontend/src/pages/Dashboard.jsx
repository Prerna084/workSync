import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ideally we might have a specific /api/dashboard endpoint, 
        // but for now we derive stats from /api/tasks
        const tasksRes = await axios.get('http://localhost:5000/api/tasks?limit=100');
        const tasks = tasksRes.data;
        
        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'completed').length
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon bg-primary-soft">
            <Activity size={24} color="var(--accent-primary)" />
          </div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.totalTasks}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-success-soft">
            <CheckCircle size={24} color="var(--success)" />
          </div>
          <div className="stat-content">
            <h3>Completed Tasks</h3>
            <p className="stat-value">{stats.completedTasks}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon bg-warning-soft">
            <Clock size={24} color="var(--warning)" />
          </div>
          <div className="stat-content">
            <h3>Pending Tasks</h3>
            <p className="stat-value">{stats.totalTasks - stats.completedTasks}</p>
          </div>
        </div>
      </div>

      <div className="recent-activity glass-panel">
        <h2 className="section-title">Getting Started</h2>
        <div className="empty-state">
           <p>Welcome to WorkSync SaaS! Navigate to <strong>Tasks</strong> on the sidebar to create and manage assignments.</p>
           {user.role === 'ADMIN' && <p>As an <strong>ADMIN</strong>, you can invite new team members from the <strong>Settings</strong> tab.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
