import { Link, redirect, useParams } from 'react-router-dom';
import { getUser } from '../../constants';
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

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function Workouts() {
  const { id } = useParams();

  if (!id) return redirect('/workouts');

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
              <BreadcrumbPage>Workout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between gap-2'>
            <div>
              <CardTitle>My Workouts</CardTitle>
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
            <WorkoutTable id={id} />
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
