import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';

const Logout = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext) {
      userContext.handleLogout();
    }
    navigate('/');
  }, [userContext, navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;