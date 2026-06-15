import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Get intended destination from location state, default to /todos
  const from = location.state?.from?.pathname || '/todos';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
      setIsLoggingOn(false); // Only stop loading if it failed
    }
    // If successful, isAuthenticated changes, and useEffect handles redirect
  }

  return (
    <div className="logon-container">
      <h2>Log On</h2>
      {authError && (
        <p style={{ color: 'red', fontWeight: 'bold' }} role="alert">
          {authError}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailInput">Email:</label>
          <input
            type="email"
            id="emailInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoggingOn}
          />
        </div>
        <div>
          <label htmlFor="passwordInput">Password:</label>
          <input
            type="password"
            id="passwordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoggingOn}
          />
        </div>

        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in... ' : 'Log On'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
