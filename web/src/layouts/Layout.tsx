import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CircleUser, Weight } from 'lucide-react';
import { User } from '@/constant.types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/constants';

export default function UserLayout({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ['user-details'],
    queryFn: (): Promise<{ success: boolean; data: User }> =>
      axios
        .get(`${API_URL}/api/user`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 tracking-wide'>
      <div className='bg-white shadow-sm'>
        <header className='py-4 px-6 flex gap-8 items-center text-sm lg:text-base lg:gap-10 max-w-7xl mx-auto w-full'>
          <Link to='/'>
            <Weight />
          </Link>
          <nav className='hidden md:block'>
            <ul className='flex gap-4'>
              <li>
                <Link
                  to='/workouts'
                  className='p-2 rounded transition duration-200 hover:bg-slate-100'
                >
                  Workouts
                </Link>
              </li>
              <li>
                <Link
                  to='/exercises'
                  className='p-2 rounded transition duration-200 hover:bg-slate-100'
                >
                  Exercises
                </Link>
              </li>
              <li>
                <Link
                  to='/leaderboards'
                  className='p-2 rounded transition duration-200 hover:bg-slate-100'
                >
                  Leaderboards
                </Link>
              </li>
            </ul>
          </nav>
          <div className='ml-auto flex gap-2 items-center'>
            {data?.data.username}
            <Link
              to='/profile'
              className='flex items-center justify-center p-2 rounded transition duration-200 hover:bg-slate-100'
            >
              <CircleUser />
            </Link>
          </div>
        </header>
      </div>
      <main className='px-6 py-8 max-w-7xl mx-auto w-full'>{children}</main>
      <footer className='p-4 text-center  text-xs font-light mt-auto'>
        <p>Made by Arron</p>
      </footer>
    </div>
  );
}
