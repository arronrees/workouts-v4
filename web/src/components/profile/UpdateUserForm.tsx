import { Form, useActionData } from 'react-router-dom';
import { Label } from '../ui/shadcn/label';
import { Input } from '../ui/shadcn/input';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/constants';
import { Button } from '../ui/shadcn/button';
import { User } from '@/constant.types';

export default function UpdateUserForm() {
  const formError = useActionData() as string | null;

  const { data, isError, error } = useQuery({
    queryKey: ['user-details'],
    queryFn: (): Promise<{ success: boolean; data: User }> =>
      axios
        .get(`${API_URL}/api/user`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isError) {
    console.log(error.message);

    return (
      <p className='error__style'>
        There was an error fetching your data, please try again.
      </p>
    );
  }

  return (
    <Form method='POST' action='/profile' className='space-y-4'>
      <div>
        <Label htmlFor='email'>Email address</Label>
        <div className='mt-2'>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            defaultValue={data?.data.email}
          />
        </div>
      </div>
      <div>
        <Label htmlFor='username'>Username</Label>
        <div className='mt-2'>
          <Input
            id='username'
            name='username'
            type='text'
            required
            autoComplete='username'
            defaultValue={data?.data.username}
          />
        </div>
      </div>
      <hr />
      <p className='pt-4 flex flex-col gap-1 font-semibold text-lg'>
        Change your password
        <span className='text-muted-foreground text-sm font-normal'>
          Leave blank to remain unchanged
        </span>
      </p>
      <div>
        <Label htmlFor='current-password'>Current Password</Label>
        <div className='mt-2'>
          <Input
            id='current-password'
            name='current-password'
            type='password'
            autoComplete='current-password'
          />
        </div>
      </div>
      <div>
        <Label htmlFor='new-password'>New Password</Label>
        <div className='mt-2'>
          <Input
            id='new-password'
            name='new-password'
            type='password'
            autoComplete='new-password'
          />
        </div>
      </div>
      <div>
        <Label htmlFor='confirm-new-password'>Confirm New Password</Label>
        <div className='mt-2'>
          <Input
            id='confirm-new-password'
            name='confirm-new-password'
            type='password'
            autoComplete='new-password'
          />
        </div>
      </div>
      <hr />

      <div>{formError && <p className='error__style'>{formError}</p>}</div>

      <div>
        <Button type='submit'>Save</Button>
      </div>
    </Form>
  );
}
