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
        <section className='flex flex-col gap-4 md:grid md:grid-cols-3 lg:gap-6 xl:gap-8'>
          <div className='md:col-span-3'>
            <fetcher.Form method='post' action='/signout'>
              <button
                type='submit'
                className='flex w-full justify-center bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500'
              >
                Sign Out
              </button>
            </fetcher.Form>
          </div>
          <div className='card text-center'>
            <p className='font-bold text-5xl mb-6 md:text-4xl lg:text-5xl xl:text-6xl'>
              40,446
            </p>
            <p className='font-thin'>KG Lifted</p>
          </div>

          <div className='card text-center'>
            <p className='font-bold text-5xl mb-6 md:text-4xl lg:text-5xl xl:text-6xl'>
              121
            </p>
            <p className='font-thin'>Sets Completed</p>
          </div>

          <div className='card text-center'>
            <p className='font-bold text-5xl mb-6 md:text-4xl lg:text-5xl xl:text-6xl'>
              1046
            </p>
            <p className='font-thin'>Reps Performed</p>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}

export default Dashboard;
