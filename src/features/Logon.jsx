import { useState } from 'react';
function Logon({ onSetEmail = () => {}, onSetToken = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    try {
      const response = await fetch('api/users/logon', {
        method: POST,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
      } else {
        setAuthError(
          `Authentication failed: ${data?.message || 'Invalid Credentials'} `,
        );
      }
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
  };
  return (
    <>
      {' '}
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
            <label htmlFor="password">Password:</label>
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
