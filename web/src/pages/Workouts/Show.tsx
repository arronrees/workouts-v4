import { Link, redirect, useParams } from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import WorkoutTable from '../../components/workouts/WorkoutTable';
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
import axios from 'axios';
import { Workout } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function ShowWorkout() {
  const { id } = useParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: (): Promise<{ success: boolean; data: Workout }> =>
      axios
        .get(`${API_URL}/api/workouts/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

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
              <BreadcrumbPage>{data?.data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>{data?.data.name}</CardTitle>
              <CardDescription>View the workout details</CardDescription>
            </div>
            <div className='flex gap-2'>
              <Button asChild size='sm' variant='secondary'>
                <Link to={`/workouts/${id}/edit`}>Edit</Link>
              </Button>
              <Button asChild size='sm'>
                <Link to={`/workouts/${id}/record`}>
                  Record Workout
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data?.data && (
              <WorkoutTable workout={data.data} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
