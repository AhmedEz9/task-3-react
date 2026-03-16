import { Link, Outlet, useNavigate } from 'react-router';
import { useUserContext } from '../hooks/ContextHooks';

const Layout = () => {
  const { user, handleLogout } = useUserContext();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <ul className="flex gap-6 items-center max-w-6xl mx-auto list-none m-0 p-0">
          <li className="font-bold text-xl mr-auto">
            <Link to="/" className="hover:text-blue-200 transition-colors">MediaApp</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-blue-200 transition-colors">Profile</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-blue-200 transition-colors">Upload</Link>
              </li>
              <li>
                <button 
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition-colors">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        {}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;