import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home, { loader as homeLoader } from './pages/Home.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error.tsx';
import SignIn, {
  action as signInAction,
  loader as signInLoader,
} from './pages/auth/SignIn.tsx';
import Dashboard, { loader as dashboardLoader } from './pages/Dashboard.tsx';
import SignUp, {
  loader as signUpLoader,
  action as signUpAction,
} from './pages/auth/SignUp.tsx';
import { signOutAction } from './constants.ts';

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    loader: homeLoader,
  },
  {
    path: '/signin',
    element: <SignIn />,
    loader: signInLoader,
    errorElement: <ErrorPage />,
    action: signInAction,
  },
  {
    path: '/signup',
    element: <SignUp />,
    loader: signUpLoader,
    errorElement: <ErrorPage />,
    action: signUpAction,
  },
  {
    path: '/signout',
    action: signOutAction,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: dashboardLoader,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
