import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    'text-sm text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100';

  const activeLink = 'text-gray-900 font-medium';

  const navLinkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? activeLink : ''}`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav>
      <ul className="flex items-center gap-1">
        <li>
          <NavLink className={navLinkClass} to="/about">
            About
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink className={navLinkClass} to="/tasks">
                Tasks
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/profile">
                Profile
              </NavLink>
            </li>
            <li>
              <button
                className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink className={navLinkClass} to="/login">
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
