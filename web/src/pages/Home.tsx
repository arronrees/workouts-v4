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
  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Home</h1>
    </div>
  );
}

export default Home;
