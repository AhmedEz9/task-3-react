import { Link, Outlet } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Layout = () => {
  const userContext = useContext(UserContext);

  return (
    <div>
      <nav>
        {}
        <ul className="list-none flex gap-5 p-0 items-center *:text-blue-600 *:font-medium *:transition-colors">
          <li><Link to="/">Home</Link></li>

          {userContext?.user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/logout">Logout</Link></li>
              <li className="ml-auto text-indigo-600">
                Hello, {userContext.user.username}!
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <main className="mt-5">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;