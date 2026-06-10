import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';

function Logoff() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login'); // Add this navigation
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div className="logoff-container">
      <p>Logged in as: {email}</p>
    </div>
  );
}

export default Logoff;
