import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    // const location = useLocation();
    // return <Navigate to="/login" state={{ from: location }} replace />;
    
    // For development/demo purposes without a login page yet, we will bypass this
    // In production, uncomment the line above and remove the bypass below.
    console.warn("Bypassing auth for development. User is not authenticated.");
  }

  return <Outlet />;
};
