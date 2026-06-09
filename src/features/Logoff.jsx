import { useAuth } from '../contexts/AuthContext';

function Logoff() {
  const { logout, email } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="logoff-container">
      <p>Logged in as: {email}</p>
      <button onClick={handleLogout}>Log Off</button>
    </div>
  );
}

export default Logoff;
