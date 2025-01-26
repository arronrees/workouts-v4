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
import Workouts, { loader as workoutsLoader } from './pages/Workouts/Index.tsx';
import CreateWorkout, {
  loader as createWorkoutLoader,
  action as createWorkoutAction,
} from './pages/Workouts/Create.tsx';
import Workout, { loader as workoutLoader } from './pages/Workouts/Show.tsx';

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
  {
    path: '/workouts',
    element: <Workouts />,
    loader: workoutsLoader,
  },
  {
    path: '/workouts/create',
    element: <CreateWorkout />,
    loader: createWorkoutLoader,
    action: createWorkoutAction,
  },
  {
    path: '/workouts/:id',
    element: <Workout />,
    loader: workoutLoader,
  },
];
