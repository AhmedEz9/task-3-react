import { Navigate } from 'react-router';
import { useUserContext } from '../hooks/ContextHooks';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;