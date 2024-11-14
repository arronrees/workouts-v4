import { redirect, useFetcher } from 'react-router-dom';
import { getUser } from '../constants';
import UserLayout from '../layouts/Layout';

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
      <div className=''>
        <h1 className='text-4xl'>Dashboard</h1>
        <div>
          <fetcher.Form method='post' action='/signout'>
            <button
              type='submit'
              className='flex w-full justify-center bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
            >
              Sign Out
            </button>
          </fetcher.Form>
        </div>
      </div>
    </UserLayout>
  );
}

export default Dashboard;
