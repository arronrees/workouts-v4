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
import Workouts, { loader as workoutsLoader } from './pages/workouts/Index.tsx';
import CreateWorkout, {
  loader as createWorkoutLoader,
  action as createWorkoutAction,
} from './pages/workouts/Create.tsx';
import ShowWorkout, {
  loader as workoutLoader,
} from './pages/workouts/Show.tsx';
import EditWorkout, {
  loader as editWorkoutLoader,
  action as editWorkoutAction,
} from './pages/workouts/Edit.tsx';
import RecordWorkout, {
  loader as recordWorkoutLoader,
  action as recordWorkoutAction,
} from './pages/workouts/Record.tsx';

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
    element: <ShowWorkout />,
    loader: workoutLoader,
  },
  {
    path: '/workouts/:id/edit',
    element: <EditWorkout />,
    loader: editWorkoutLoader,
    action: editWorkoutAction,
  },
  {
    path: '/workouts/:id/record',
    element: <RecordWorkout />,
    loader: recordWorkoutLoader,
    action: recordWorkoutAction,
  },
];
