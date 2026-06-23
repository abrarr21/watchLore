import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../hooks';

const PublicRoute = () => {
  const { user, isLoading } = useAppSelector((store) => store.auth);

  if (isLoading) return <h1>Loading.....</h1>;

  if (user) {
    return <Navigate to={'/home'} />;
  }

  return <Outlet />;
};

export default PublicRoute;
