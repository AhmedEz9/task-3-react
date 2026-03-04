import { Navigate, useLocation } from 'react-router';
import { useUserContext } from '../hooks/ContextHooks';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;