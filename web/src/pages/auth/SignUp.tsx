import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import axios, { AxiosError } from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';

export async function loader() {
  const user = await getUser();

  if (user) {
    return redirect('/dashboard');
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get('username'),
    email = formData.get('email'),
    password = formData.get('password');

  try {
    await axios.post(
      `${API_URL}/api/auth/signup`,
      {
        username,
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
        : 'Could not create account, please try again later.';
    }

    return null;
  }
}

export default function SignUp() {
  const error = useActionData() as string | null;

  return (
    <div className='h-screen'>
      <div className='h-full'>
        <div className='flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
          <Card className='max-w-md min-w-64 sm:min-w-[450px]'>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your details below to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method='POST' className='space-y-4'>
                <div>
                  <Label htmlFor='username'>Username</Label>
                  <div className='mt-2'>
                    <Input
                      id='username'
                      name='username'
                      type='text'
                      required
                      autoComplete='username'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='email' className='form__label'>
                    Email address
                  </Label>
                  <div className='mt-2'>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      required
                      autoComplete='email'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='password'>Password</Label>
                  <div className='mt-2'>
                    <Input
                      id='password'
                      name='password'
                      type='password'
                      required
                      autoComplete='current-password'
                    />
                  </div>
                </div>

                <div>{error && <p className='error__style'>{error}</p>}</div>

                <div>
                  <Button type='submit' className='w-full'>
                    Create Account
                  </Button>
                </div>
              </Form>
            </CardContent>
            <CardFooter>
              <p className='text-sm font-light'>
                Already a member?{' '}
                <Link to='/signin' className='font-medium'>
                  Sign In Here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
