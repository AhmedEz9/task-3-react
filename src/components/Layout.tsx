import { Link, Outlet } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Layout = () => {
  // 1. Connect to our global memory bubble!
  const userContext = useContext(UserContext);

  return (
    <div>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', padding: 0, alignItems: 'center' }}>
          <li><Link to="/">Home</Link></li>

          {/* 2. Check if a user is currently logged in */}
          {userContext?.user ? (
            // IF LOGGED IN: Show Profile, Upload, Logout, and a Welcome message
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/logout">Logout</Link></li>
              <li style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'blue' }}>
                Hello, {userContext.user.username}!
              </li>
            </>
          ) : (
            // IF NOT LOGGED IN: Only show the Login link
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
      
      <main style={{ marginTop: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;