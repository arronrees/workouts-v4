import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
} from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import axios, { AxiosError } from 'axios';

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
    <div className='h-screen bg-beige text-green-dark'>
      <div className='h-full'>
        <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <svg
              width='80'
              height='80'
              viewBox='0 0 80 80'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='h-24 w-auto mx-auto'
            >
              <path
                d='M80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40Z'
                fill='#1D2633'
              ></path>
              <path
                d='M69.7136 50.2133C71.0644 50.2133 72.0252 51.5261 71.5172 52.7777C66.4666 65.2233 54.2582 74 39.9999 74C25.7417 74 13.5333 65.2233 8.48263 52.7777C7.97466 51.5261 8.93548 50.2133 10.2863 50.2133H69.7136Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M71.5172 27.2222C72.0252 28.4739 71.0644 29.7867 69.7136 29.7867H10.2863C8.93549 29.7867 7.97468 28.4739 8.48264 27.2222C13.5333 14.7767 25.7417 6 39.9999 6C54.2582 6 66.4665 14.7767 71.5172 27.2222Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M69.837 37.1499C72.0842 37.1499 73.1686 38.7177 73.1686 40.5337V43.9437H70.8169V40.9388C70.8169 40.1157 70.5164 39.4363 69.6541 39.4363C68.7918 39.4363 68.5044 40.1157 68.5044 40.9388V43.9437H66.1527V40.9388C66.1527 40.1157 65.8653 39.4363 65.003 39.4363C64.1407 39.4363 63.8402 40.1157 63.8402 40.9388V43.9437H61.4885V40.5337C61.4885 38.7177 62.5729 37.1499 64.8201 37.1499C66.0482 37.1499 66.9366 37.6333 67.3416 38.4303C67.7728 37.6333 68.7135 37.1499 69.837 37.1499Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M57.2627 41.8533C58.0205 41.8533 58.3471 41.1609 58.3471 40.3378V37.4112H60.6988V40.6252C60.6988 42.5457 59.5752 44.1397 57.2627 44.1397C54.9502 44.1397 53.8267 42.5457 53.8267 40.6252V37.4112H56.1783V40.3378C56.1783 41.1609 56.505 41.8533 57.2627 41.8533Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M50.3687 44.1527C48.8924 44.1527 47.9386 43.6432 47.3769 42.6503L49.0753 41.6965C49.3105 42.1146 49.6632 42.3236 50.2511 42.3236C50.7345 42.3236 50.9566 42.1538 50.9566 41.9448C50.9566 41.1478 47.5075 41.9578 47.5075 39.4232C47.5075 38.1951 48.5527 37.2022 50.3295 37.2022C51.8843 37.2022 52.7335 37.9599 53.1124 38.6916L51.4139 39.6584C51.2702 39.2664 50.826 39.0313 50.3818 39.0313C50.0421 39.0313 49.8592 39.175 49.8592 39.371C49.8592 40.181 53.3083 39.4363 53.3083 41.8925C53.3083 43.2643 51.9627 44.1527 50.3687 44.1527Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M42.1524 46.9486H39.8007V40.6644C39.8007 38.6655 41.3032 37.2152 43.3936 37.2152C45.4317 37.2152 46.9864 38.77 46.9864 40.6644C46.9864 42.7548 45.6016 44.1397 43.5242 44.1397C43.0408 44.1397 42.5574 43.996 42.1524 43.7738V46.9486ZM43.3936 41.9317C44.1383 41.9317 44.6347 41.3568 44.6347 40.6775C44.6347 39.985 44.1383 39.4232 43.3936 39.4232C42.6489 39.4232 42.1524 39.985 42.1524 40.6775C42.1524 41.3568 42.6489 41.9317 43.3936 41.9317Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M37.4449 36.7188C36.6741 36.7188 36.0339 36.0786 36.0339 35.3078C36.0339 34.5369 36.6741 33.8967 37.4449 33.8967C38.2158 33.8967 38.856 34.5369 38.856 35.3078C38.856 36.0786 38.2158 36.7188 37.4449 36.7188ZM36.2691 37.4112H38.6208V43.9437H36.2691V37.4112Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M31.7571 44.1397C29.719 44.1397 28.1642 42.5719 28.1642 40.6644C28.1642 38.77 29.719 37.2022 31.7571 37.2022C33.7952 37.2022 35.35 38.77 35.35 40.6644C35.35 42.5719 33.7952 44.1397 31.7571 44.1397ZM31.7571 41.9317C32.5018 41.9317 32.9983 41.3568 32.9983 40.6775C32.9983 39.985 32.5018 39.4102 31.7571 39.4102C31.0124 39.4102 30.5159 39.985 30.5159 40.6775C30.5159 41.3568 31.0124 41.9317 31.7571 41.9317Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M23.7237 47.1446C22.1036 47.1446 20.9278 46.426 20.3268 45.1457L22.2735 44.1005C22.4825 44.5447 22.8745 45.002 23.6845 45.002C24.5337 45.002 25.0955 44.4663 25.1608 43.5256C24.8473 43.8 24.3508 44.009 23.6061 44.009C21.7901 44.009 20.3268 42.6111 20.3268 40.6513C20.3268 38.7569 21.8815 37.2152 23.9197 37.2152C26.01 37.2152 27.5125 38.6655 27.5125 40.6644V43.2513C27.5125 45.6029 25.8794 47.1446 23.7237 47.1446ZM23.8805 41.801C24.586 41.801 25.1216 41.3176 25.1216 40.5991C25.1216 39.8936 24.586 39.4232 23.8805 39.4232C23.188 39.4232 22.6393 39.8936 22.6393 40.5991C22.6393 41.3176 23.188 41.801 23.8805 41.801Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M16.3374 44.1397C14.2993 44.1397 12.7445 42.5719 12.7445 40.6644C12.7445 38.77 14.2993 37.2022 16.3374 37.2022C18.3755 37.2022 19.9303 38.77 19.9303 40.6644C19.9303 42.5719 18.3755 44.1397 16.3374 44.1397ZM16.3374 41.9317C17.0821 41.9317 17.5786 41.3568 17.5786 40.6775C17.5786 39.985 17.0821 39.4102 16.3374 39.4102C15.5927 39.4102 15.0962 39.985 15.0962 40.6775C15.0962 41.3568 15.5927 41.9317 16.3374 41.9317Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M8.46218 35.1249V41.7227H12.3555V43.9437H8.13556C6.64615 43.9437 6.04517 43.1598 6.04517 41.9186V35.1249H8.46218Z'
                fill='#EDEBDE'
              ></path>
              <path
                d='M33.9999 6.52774C35.9476 6.18095 37.9526 6 40 6C42.0473 6 44.0523 6.18095 45.9999 6.52773V29.7867H33.9999V6.52774Z'
                fill='#AC2828'
              ></path>
              <path
                d='M46.0004 50.2133H33.9993C33.9741 55.4312 33.0234 60.6038 31.1909 65.4906L28.7185 72.0836C32.2486 73.3249 36.0454 74 39.9999 74C43.9543 74 47.7511 73.3249 51.2812 72.0836L48.8088 65.4906C46.9763 60.6038 46.0256 55.4312 46.0004 50.2133Z'
                fill='#AC2828'
              ></path>
              <path
                d='M46 6.52771C50.3408 7.3006 54.3967 8.89722 58 11.1502V29.7867H46V6.52771Z'
                fill='#306A9F'
              ></path>
              <path
                d='M51.2813 72.0836C56.7387 70.1647 61.5589 66.8928 65.3391 62.6704L64.7492 62.295C60.6056 59.6581 58.073 55.1147 58.0015 50.2133H46.0005C46.0257 55.4312 46.9764 60.6038 48.809 65.4906L51.2813 72.0836Z'
                fill='#306A9F'
              ></path>
              <path
                d='M21.9999 11.1502C25.6032 8.89723 29.659 7.3006 33.9999 6.52771V29.7867H21.9999V11.1502Z'
                fill='#DEB038'
              ></path>
              <path
                d='M21.9983 50.2133H33.9993C33.9742 55.4089 33.0315 60.5596 31.2143 65.428L28.7185 72.0836C23.261 70.1647 18.4409 66.8928 14.6606 62.6704L15.2505 62.295C19.3941 59.6581 21.9268 55.1147 21.9983 50.2133Z'
                fill='#DEB038'
              ></path>
            </svg>
            <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-green-dark'>
              Sign Up
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <Form method='POST' className='space-y-4'>
              <div>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-green-dark'
                >
                  Username
                </label>
                <div className='mt-2'>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    required
                    autoComplete='username'
                    className='block w-full border-0 py-1.5 text-green-dark shadow-sm ring-1 ring-inset ring-green-mid placeholder:text-green-mid focus:ring-2 focus:ring-inset focus:ring-green-mid sm:text-sm'
                  />
                </div>
              </div>

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
                <button
                  type='submit'
                  className='btn flex w-full justify-center'
                >
                  Create Account
                </button>
              </div>
            </Form>

            <p className='mt-10 text-center text-sm text-green-mid'>
              Already a member?{' '}
              <Link
                to='/signin'
                className='font-semibold text-green-dark hover:text-green-mid'
              >
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
