import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import axios, { AxiosError } from 'axios';
import Logo from '../../components/brand/Logo';

export async function loader() {
  const user = await getUser();

  if (user) {
    return redirect('/dashboard');
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email'),
    password = formData.get('password');

  try {
    await axios.post(
      `${API_URL}/api/auth/signin`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    return null;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log(err.response?.data?.error);

      return err.response?.data?.error
        ? err.response?.data?.error
        : 'Could not sign in, please try again.';
    }

    return null;
  }
}

export default function SignIn() {
  const error = useActionData() as string | null;

  return (
    <div className='h-screen bg-beige text-green-dark'>
      <div className='h-full'>
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <Logo className='h-24 w-auto mx-auto' />
            <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-green-dark'>
              Sign In
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <Form method='POST' className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-green-dark'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    className='block w-full border-0 py-1.5 text-green-dark shadow-sm ring-1 ring-inset ring-green-mid placeholder:text-green-mid focus:ring-2 focus:ring-inset focus:ring-green-mid sm:text-sm'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-green-dark'
                  >
                    Password
                  </label>
                  <div>
                    <a
                      href='/forgot-password'
                      className='font-semibold text-xs text-green-mid hover:text-green-mid'
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    autoComplete='current-password'
                    className='block w-full border-0 py-1.5 text-green-dark shadow-sm ring-1 ring-inset ring-green-mid placeholder:text-green-mid focus:ring-2 focus:ring-inset focus:ring-green-mid sm:text-sm'
                  />
                </div>
              </div>

              <div>
                {error && (
                  <p className='text-red-500 text-sm font-light'>{error}</p>
                )}
              </div>

              <div>
                <button type='submit' className='btn--primary !w-full'>
                  Sign In
                </button>
              </div>
            </Form>

            <p className='mt-10 text-center text-sm text-green-mid'>
              Not a member?{' '}
              <Link
                to='/signup'
                className='font-semibold text-green-dark hover:text-green-mid'
              >
                Sign Up Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
