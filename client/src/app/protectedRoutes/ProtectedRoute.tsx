import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks';

const ProtectedRoute = () => {
  const { user, isLoading } = useAppSelector((store) => store.auth);

  if (isLoading) return <h1>Loading...</h1>;

  if (!user) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
