import { Link, redirect } from 'react-router-dom';
import { getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import WorkoutTable from '../../components/workouts/WorkoutTable';
import ArrowAngle from '../../components/ui/ArrowAngle';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function Workouts() {
  return (
    <UserLayout>
      <div className=''>
        <h1 className='text-xl md:text-2xl font-semibold mb-4 uppercase tracking-wider'>
          Workouts
        </h1>
        <section className='flex flex-col gap-4 md:grid md:grid-cols-3 lg:gap-6 xl:gap-8'>
          <div className='card md:col-span-3'>
            <div className='flex flex-col gap-6 md:flex-row md:justify-between'>
              <div className='flex flex-col gap-2 md:gap-3'>
                <p className='font-medium text-xl md:text-2xl'>My Workouts</p>
                <p className='font-extralight text-sm'>
                  A list of workouts you created.
                </p>
              </div>
              <div>
                <Link to='/workouts/create' className='btn--primary'>
                  Create New Workout
                  <ArrowAngle />
                </Link>
              </div>
            </div>
            <div className='mt-6'>
              <div className='overflow-x-auto whitespace-nowrap w-full'>
                <WorkoutTable />
              </div>
            </div>
          </div>

          <div className='card md:col-span-3'>
            <div className='flex flex-col gap-6 md:flex-row md:justify-between'>
              <div className='flex flex-col gap-2 md:gap-3'>
                <p className='font-medium text-xl md:text-2xl'>
                  Workout History
                </p>
                <p className='font-extralight text-sm'>
                  Recent workouts you've completed.
                </p>
              </div>
              <div>
                <a href='/' className='btn--primary'>
                  View Progress
                  <ArrowAngle />
                </a>
              </div>
            </div>
            <div className='mt-6'>
              <div className='overflow-x-auto whitespace-nowrap w-full'>
                <table>
                  <thead>
                    <tr className='text-green-mid font-normal'>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Sets Completed</th>
                      <th>Weight Lifted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2nd September</td>
                      <td>Push</td>
                      <td>21</td>
                      <td>1400kg</td>
                    </tr>
                    <tr>
                      <td>28th August</td>
                      <td>Legs</td>
                      <td>24</td>
                      <td>3200kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
