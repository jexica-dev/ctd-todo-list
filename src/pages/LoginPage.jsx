import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import DOMPurify from 'dompurify';

// Validates email format before sanitization
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const from = location.state?.from?.pathname || '/tasks';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    // Validate before sanitizing
    if (!isValidEmail(email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      setAuthError('Password is required.');
      return;
    }

    // Sanitize inputs (strips any injected HTML/scripts)
    const cleanEmail = DOMPurify.sanitize(email.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    const cleanPassword = DOMPurify.sanitize(password, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    setIsLoggingOn(true);
    const result = await login(cleanEmail, cleanPassword);

    if (!result.success) {
      setAuthError('Invalid email or password. Please try again.');
      setIsLoggingOn(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {authError && (
          <div
            role="alert"
            className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700"
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="emailInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoggingOn}
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 transition"
            />
          </div>

          <div>
            <label
              htmlFor="passwordInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggingOn}
              maxLength={128}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingOn}
            className="w-full py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoggingOn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
