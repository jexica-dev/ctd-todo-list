import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <div
      className="not-found-container"
      style={{ textAlign: 'center', marginTop: '50px' }}
    >
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>

      <div className="navigation-links" style={{ marginTop: '20px' }}>
        <p>Would you like to go back to:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/todos">My Tasks</Link>
          </li>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/about">About This App</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NotFoundPage;
