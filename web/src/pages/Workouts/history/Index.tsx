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
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { Workout } from '@/constant.types';
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

  const { data, isError, error } = useQuery({
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
              <CardTitle>Workout History</CardTitle>
              <CardDescription>
                View times you've completed this workout
              </CardDescription>
            </div>
            <Button asChild size='sm'>
              <Link to={`/workouts/${id}/history`}>
                All History
                <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>{id && <WorkoutHistoryTable id={id} />}</CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
