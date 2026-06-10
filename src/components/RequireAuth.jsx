import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login, but save the current location so we can
      // send the user back here after they successfully log in
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // If not authenticated, we return a loading indicator while
  // the useEffect handles the redirection
  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  // If authenticated, render the protected children
  return children;
}

export default RequireAuth;
