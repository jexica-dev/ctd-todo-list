import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <p className="text-6xl font-semibold text-gray-100 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <div className="flex flex-col gap-2">
        {[
          { to: '/tasks', label: 'Tasks' },
          { to: '/profile', label: 'Profile' },
          { to: '/about', label: 'About' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-sm text-brand-600 hover:text-brand-700 hover:underline transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NotFoundPage;
