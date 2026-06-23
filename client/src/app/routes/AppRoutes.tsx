import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../../features/auth/ui/Login';
import Register from '../../features/auth/ui/Register';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { currentLoggedInUser } from '../../features/auth/state/auth/authAction';
import PublicRoute from '../protectedRoutes/PublicRoute';
import ProtectedRoute from '../protectedRoutes/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRoutes = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(currentLoggedInUser());
  }, []);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <PublicRoute />,
      children: [
        {
          path: '',
          element: <AuthLayout />,
          children: [
            {
              path: '',
              element: <Login />,
            },
            {
              path: 'register',
              element: <Register />,
            },
          ],
        },
      ],
    },

    // Protected Routes
    {
      path: '/home',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <DashboardLayout />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
