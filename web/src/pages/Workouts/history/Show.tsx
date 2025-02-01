import { Link, redirect, useParams } from 'react-router-dom';
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
import axios from 'axios';
import { WorkoutInstance } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';
import { API_URL, getUser } from '@/constants';
import UserLayout from '@/layouts/Layout';
import WorkoutInstanceTable from '@/components/workouts/WorkoutInstanceTable';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function ShowWorkoutInstance() {
  const { id, instanceId } = useParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-instance', instanceId],
    queryFn: (): Promise<{ success: boolean; data: WorkoutInstance }> =>
      axios
        .get(`${API_URL}/api/workouts/history/${id}/${instanceId}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching the workout history, please try again.
      </p>
    );
  }

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
              <BreadcrumbLink href='/workouts'>Workouts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/workouts/${data?.data.workoutId}`}>
                {data?.data.workout.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/workouts/${data?.data.workoutId}/history`}
              >
                History
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {data?.data.createdAt &&
                  new Date(data?.data.createdAt).toDateString()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>{data?.data.workout.name}</CardTitle>
              <CardDescription>View the workout details</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button asChild size='sm' variant='secondary'>
                <Link to={`/workouts/${id}/history`}>Back To History</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data?.data && (
              <WorkoutInstanceTable
                instance={data.data}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
