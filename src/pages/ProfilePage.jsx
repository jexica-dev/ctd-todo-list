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

  const completionPct =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const initials = email ? email.slice(0, 2).toUpperCase() : '?';

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
        Error: {error}
      </div>
    );

  return (
    <div className="animate-fade-in space-y-6 py-2">
      {/* Avatar + email */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <div>
          <p className="font-medium text-gray-900">{email || 'Guest'}</p>
          <p className="text-sm text-gray-400">Registered user</p>
        </div>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Task statistics
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Completed', value: stats.completed },
            { label: 'Active', value: stats.active },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-100 p-4 text-center"
            >
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress bar */}
      <section className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Completion rate</p>
          <p className="text-sm font-semibold text-brand-600">
            {completionPct}%
          </p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
