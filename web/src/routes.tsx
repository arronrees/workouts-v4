import { RouteObject } from 'react-router-dom';
import Home, { loader as homeLoader } from './pages/Home.tsx';
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

export const routes: RouteObject[] = [
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
];
