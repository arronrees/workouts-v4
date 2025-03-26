import UpdateUserForm from '@/components/profile/UpdateUserForm';
import PageStructure from '@/components/ui/PageStructure';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { API_URL, getUser } from '@/constants';
import UserLayout from '@/layouts/Layout';
import axios, { AxiosError } from 'axios';
import { ActionFunctionArgs, redirect, useFetcher } from 'react-router-dom';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email'),
    username = formData.get('username'),
    currentPassword = formData.get('current-password'),
    newPassword = formData.get('new-password'),
    confirmNewPassword = formData.get('confirm-new-password');

  try {
    await axios.post(
      `${API_URL}/api/user/update`,
      {
        email,
        username,
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
      { withCredentials: true }
    );

    return redirect('/dashboard');
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

export default function Profile() {
  const fetcher = useFetcher();

  return (
    <UserLayout>
      <PageStructure>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateUserForm />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <fetcher.Form method='post' action='/signout'>
              <button
                type='submit'
                className='flex w-full justify-center bg-red-500 rounded max-w-max px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
              >
                Sign Out
              </button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
