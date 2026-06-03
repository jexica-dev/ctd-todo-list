import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Logon() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  };

  return (
    <>
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
    </>
  );
}

export default Logon;
