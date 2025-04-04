import { Link, redirect } from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import WorkoutsTable from '../../components/workouts/WorkoutsTable';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/shadcn/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import PageStructure from '@/components/ui/PageStructure';
import { Button } from '@/components/ui/shadcn/button';
import { ArrowUpRight } from 'lucide-react';
import WorkoutHistoryTable from '@/components/workouts/WorkoutHistoryTable';
import axios from 'axios';
import { WorkoutInstance } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function Workouts() {
  const limit = 5;

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-history-all', limit],
    queryFn: (): Promise<{ success: boolean; data: WorkoutInstance[] }> =>
      axios
        .get(`${API_URL}/api/workouts/history?limit=${limit}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

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
              <BreadcrumbPage>Workouts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>My Workouts</CardTitle>
              <CardDescription>
                A list of workouts you have created.
              </CardDescription>
            </div>
            <Button asChild size='sm'>
              <Link to='/workouts/create'>
                Create New Workout
                <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <WorkoutsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>
                A list of all the workouts you have completed.
              </CardDescription>
            </div>
            <Button asChild size='sm'>
              <Link to='/workouts/history'>
                All History
                <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <WorkoutHistoryTable
              isError={isError}
              isLoading={isLoading}
              error={error}
              data={data?.data}
              showWorkout
            />
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
