import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { email, token } = useAuth();

  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) throw new Error('Unauthorized');
        if (!response.ok) throw new Error('Failed to fetch statistics');

        const data = await response.json();
        const tasks = data.tasks || [];

        // Calculate statistics
        const total = tasks.length;
        const completed = tasks.filter((t) => t.isCompleted).length;
        const active = total - completed;

        setStats({ total, completed, active });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  // Calculate completion rate safely
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="user-info">
        <p>
          <strong>Username:</strong> {email || 'Guest'}
        </p>
      </div>

      <section className="stats-section">
        <h2>Todo Statistics</h2>
        <div className="stats-grid" style={{ display: 'flex', gap: '20px' }}>
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p>{stats.active}</p>
          </div>
        </div>
        <p>
          <strong>Completion Rate:</strong> {completionPercentage}%
        </p>
      </section>
    </div>
  );
}

export default ProfilePage;
