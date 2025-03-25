import { redirect, useParams } from 'react-router-dom';
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
import axios from 'axios';
import { WorkoutInstance } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';
import WorkoutHistoryTable from '@/components/workouts/WorkoutHistoryTable';
import { API_URL, getUser } from '@/constants';
import UserLayout from '@/layouts/Layout';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function WorkoutHistory() {
  const { id } = useParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-history', id],
    queryFn: (): Promise<{ success: boolean; data: WorkoutInstance[] }> =>
      axios
        .get(`${API_URL}/api/workouts/history/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    return (
      <p className='error__style'>
        There was an error fetching the workout, please try again.
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
              <BreadcrumbLink href={`/workouts/${data?.data[0]?.workoutId}`}>
                {data?.data[0]?.workout.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>History</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>
                View times you've completed this workout
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {id && (
              <WorkoutHistoryTable
                isLoading={isLoading}
                data={data?.data}
                isError={isError}
                error={error}
              />
            )}
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
