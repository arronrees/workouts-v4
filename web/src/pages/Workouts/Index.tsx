import { Outlet, redirect } from 'react-router-dom';
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
      <Outlet />

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
          <CardHeader>
            <CardTitle>My Workouts</CardTitle>
            <CardDescription>
              A list of workouts you have created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutTable />
          </CardContent>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
