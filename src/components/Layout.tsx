import {Link, Outlet} from 'react-router';

const Layout = () => {
  return (
    <div>
      <nav>
        <ul style={{listStyle: 'none', display: 'flex', gap: '20px', padding: 0}}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
        </ul>
      </nav>
      
      <main style={{marginTop: '20px'}}>
        {}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;