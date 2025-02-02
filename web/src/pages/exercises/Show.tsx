import { redirect, useParams } from 'react-router-dom';
import { API_URL, getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import ExerciseTable from '../../components/exercises/ExerciseTable';
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
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Workout, WorkoutExerciseInstance } from '@/constant.types';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export interface ExerciseProgressionHistory {
  id: string;
  exercises: WorkoutExerciseInstance[];
  workout: Workout;
  createdAt: Date;
}

export default function ShowExercise() {
  const { id } = useParams();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['workout-exercises', id],
    queryFn: (): Promise<{
      success: boolean;
      data: ExerciseProgressionHistory[];
    }> =>
      axios
        .get(`${API_URL}/api/workout-exercises/${id}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching your workouts, please try again.
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
              <BreadcrumbLink href='/exercises'>Exercises</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {data?.data[0]?.exercises[0].exercise.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>{data?.data[0]?.exercises[0].exercise.name}</CardTitle>
            <CardDescription>
              Here shows the progress of this exercise
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.data && (
              <ExerciseTable isLoading={isLoading} history={data.data} />
            )}
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
