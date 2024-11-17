import { ReactNode } from 'react';
import Logo from '../components/brand/Logo';
import { Link } from 'react-router-dom';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-beige text-green-dark flex flex-col'>
      <header className='py-4 px-6 bg-green-dark text-beige flex gap-8 items-center text-sm lg:text-base lg:gap-10'>
        <Link to='/'>
          <Logo className='h-16 w-auto' />
        </Link>
        <nav className='hidden md:block'>
          <ul className='flex gap-8 lg:gap-10'>
            <li>
              <Link to='/workouts'>Workouts</Link>
            </li>
            <li>
              <Link to='/exercises'>Exercises</Link>
            </li>
            <li>
              <Link to='/progress'>Progress</Link>
            </li>
            <li>
              <Link to='/leagues'>Leagues</Link>
            </li>
          </ul>
        </nav>
        <div className='ml-auto'>
          <button
            type='button'
            className='flex items-center justify-center p-2 border-2'
          >
            <svg
              width='41'
              height='41'
              viewBox='0 0 41 41'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='w-6 h-6'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M34.5556 35.4219C36.593 33.5075 38.2161 31.1955 39.3246 28.6289C40.433 26.0624 41.0032 23.2957 41 20.5C41 9.17769 31.8223 0 20.5 0C9.1777 0 1.3686e-05 9.17769 1.3686e-05 20.5C-0.00322111 23.2957 0.567005 26.0624 1.67544 28.6289C2.78388 31.1955 4.40696 33.5075 6.44437 35.4219C10.2436 39.0107 15.2738 41.007 20.5 41C25.7262 41.007 30.7564 39.0107 34.5556 35.4219ZM8.1895 32.7201C9.66566 30.8733 11.5389 29.3828 13.6701 28.3592C15.8013 27.3356 18.1357 26.8053 20.5 26.8077C22.8643 26.8053 25.1987 27.3356 27.3299 28.3592C29.4611 29.3828 31.3343 30.8733 32.8105 32.7201C31.2 34.3468 29.2825 35.6376 27.1693 36.5176C25.056 37.3975 22.7891 37.8491 20.5 37.8461C18.2109 37.8491 15.944 37.3975 13.8307 36.5176C11.7175 35.6376 9.8 34.3468 8.1895 32.7201ZM28.3846 14.1923C28.3846 16.2834 27.5539 18.2889 26.0753 19.7676C24.5966 21.2462 22.5911 22.0769 20.5 22.0769C18.4089 22.0769 16.4034 21.2462 14.9247 19.7676C13.4461 18.2889 12.6154 16.2834 12.6154 14.1923C12.6154 12.1012 13.4461 10.0957 14.9247 8.61704C16.4034 7.13839 18.4089 6.30769 20.5 6.30769C22.5911 6.30769 24.5966 7.13839 26.0753 8.61704C27.5539 10.0957 28.3846 12.1012 28.3846 14.1923Z'
                fill='white'
              />
            </svg>
          </button>
        </div>
      </header>
      <main className='px-6 py-8'>{children}</main>
      <footer className='bg-green-dark p-4 text-center text-beige text-xs font-light mt-auto'>
        <p>Made by Arron</p>
      </footer>
    </div>
  );
}
