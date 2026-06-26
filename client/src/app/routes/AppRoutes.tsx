import { createBrowserRouter, RouterProvider } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../../features/auth/ui/Login';
import Register from '../../features/auth/ui/Register';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { currentLoggedInUser } from '../../features/auth/state/auth/authAction';
import PublicRoute from '../protectedRoutes/PublicRoute';
import ProtectedRoute from '../protectedRoutes/ProtectedRoute';
import Landingpage from '../../pages/Landingpage';
import DiscoverPage from '../../features/discover/ui/DiscoverPage';
import MoviesPage from '../../features/movies/ui/MoviesPage';
import SeriesPage from '../../features/series/ui/SeriesPage';
import AnimePage from '../../features/anime/ui/AnimePage';
import { VaultPage } from '../../features/vault/ui/vaultPage';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((store) => store.theme.mode);

  useEffect(() => {
    dispatch(currentLoggedInUser());
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);
  const router = createBrowserRouter([
    // UNauthenticated routes (redirects to /home if user is logged in)
    {
      path: '/',
      element: <PublicRoute />,
      children: [
        {
          index: true,
          element: <Landingpage />,
        },
        {
          element: <AuthLayout />,
          children: [
            {
              path: 'login',
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
      element: <ProtectedRoute />,
      children: [
        {
          path: 'home',
          element: <DiscoverPage />,
        },
        {
          path: 'movies',
          element: <MoviesPage />,
        },
        {
          path: 'series',
          element: <SeriesPage />,
        },
        {
          path: 'anime',
          element: <AnimePage />,
        },
        {
          path: 'vault',
          element: <VaultPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
