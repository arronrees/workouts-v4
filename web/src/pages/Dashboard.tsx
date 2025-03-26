import { redirect } from 'react-router-dom';
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
import TotalWeight from '@/components/dashboard/TotalWeight';
import TotalSets from '@/components/dashboard/TotalSets';
import TotalReps from '@/components/dashboard/TotalReps';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

function Dashboard() {
  return (
    <UserLayout>
      <PageStructure>
        <div className='grid gap-4 md:grid-cols-3 lg:gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
              <CardTitle className='text-xs font-normal text-muted-foreground uppercase tracking-wider'>
                Total Volume Lifted
              </CardTitle>
              <Weight className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-5xl tracking-wider font-light'>
                <TotalWeight />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
              <CardTitle className='text-xs font-normal text-muted-foreground uppercase tracking-wider'>
                Sets Completed
              </CardTitle>
              <Dumbbell className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-5xl tracking-wider font-light'>
                <TotalSets />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
              <CardTitle className='text-xs font-normal text-muted-foreground uppercase tracking-wider'>
                Reps Performed
              </CardTitle>
              <Repeat2 className='h-6 w-6 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-5xl tracking-wider font-light'>
                <TotalReps />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageStructure>
    </UserLayout>
  );
}

export default Dashboard;
