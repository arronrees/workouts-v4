// import axios from 'axios';
// import { API_URL } from './constants';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { queryClient } from './main';

import { redirect } from 'react-router-dom';
import { getUser } from '../constants';

export async function loader() {
  const user = await getUser();

  if (user) {
    return redirect('/dashboard');
  }

  return null;
}

function Home() {
  // const signOutMutation = useMutation({
  //   mutationFn: () =>
  //     axios.delete(`${API_URL}/api/auth/signout`, { withCredentials: true }),
  //   onSettled: () => {
  //     console.log('sign out');
  //     queryClient.invalidateQueries();
  //   },
  // });

  // // console.log({ signOutMutation });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   console.log('error', error);
  // }

  // if (data) {
  //   console.log(data.data);
  // } else {
  //   console.log('no data');
  // }

  // return (
  //   <>
  //     <div className='p-8'>
  //       <h1>Home</h1>
  //       <div className='p-8'>
  //         {isError && (
  //           <button
  //             className='block'
  //             onClick={(e) => {
  //               e.preventDefault();
  //               signInMutation.mutate();
  //             }}
  //           >
  //             Sign In
  //           </button>
  //         )}
  //         {data && (
  //           <button
  //             className='block'
  //             onClick={(e) => {
  //               e.preventDefault();
  //               signOutMutation.mutate();
  //             }}
  //           >
  //             Sign Out
  //           </button>
  //         )}
  //       </div>
  //       <div>Username: {data && !isError ? data?.data?.username : 'n/a'}</div>
  //     </div>
  //   </>
  // );

  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Home</h1>
    </div>
  );
}

export default Home;
