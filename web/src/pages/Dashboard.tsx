import { redirect, useFetcher } from 'react-router-dom';
import { getUser } from '../constants';
import UserLayout from '../layouts/Layout';
import PageStructure from '@/components/ui/PageStructure';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Dumbbell, Repeat2, Weight } from 'lucide-react';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

function Dashboard() {
  const fetcher = useFetcher();

  return (
    <UserLayout>
      <PageStructure>
        <div className='md:col-span-3'>
          <fetcher.Form method='post' action='/signout'>
            <button
              type='submit'
              className='flex w-full justify-center bg-red-500 rounded max-w-max px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
            >
              Sign Out
            </button>
          </fetcher.Form>
        </div>
        <div className='grid gap-4 md:grid-cols-3 lg:gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-normal'>
                Total Volume Lifted
              </CardTitle>
              <Weight className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>4398 kg</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-normal'>
                Sets Completed
              </CardTitle>
              <Dumbbell className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>184</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-normal'>
                Reps Performed
              </CardTitle>
              <Repeat2 className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>625</div>
            </CardContent>
          </Card>
        </div>
      </PageStructure>
    </UserLayout>
  );
}

export default Dashboard;
