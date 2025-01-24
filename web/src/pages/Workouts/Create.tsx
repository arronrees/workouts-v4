import { Form, redirect } from 'react-router-dom';
import { getUser } from '../../constants';
import UserLayout from '../../layouts/Layout';
import PageStructure from '@/components/ui/PageStructure';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';

export async function loader() {
  const user = await getUser();

  if (!user) {
    return redirect('/signin');
  }

  return {};
}

export default function CreateWorkout() {
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
          <CardHeader>
            <CardTitle>Create Workout</CardTitle>
            <CardDescription>
              Add your excerises and create your workout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method='POST' className='space-y-4'>
              <div>
                <Label htmlFor='password'>Workout Name</Label>
                <div className='mt-2'>
                  <Input
                    id='workout_name'
                    name='workout_name'
                    type='text'
                    required
                  />
                </div>
              </div>

              <div className='flex'>
                <Button type='submit' className='w-full max-w-max ml-auto'>
                  Create
                </Button>
              </div>
            </Form>
          </CardContent>
          <CardFooter className='flex items-center justify-between gap-2'>
            <Button type='button' variant='ghost'>
              Back
            </Button>
            <Button type='button' variant='secondary'>
              Next
            </Button>
          </CardFooter>
        </Card>
      </PageStructure>
    </UserLayout>
  );
}
