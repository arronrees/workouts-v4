import { Button } from '@/components/ui/shadcn/button';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold '>404</p>
          <h1 className='mt-4 text-balance text-5xl font-semibold tracking-wide  sm:text-7xl'>
            <i>{error.statusText}</i>
          </h1>
          <p className='mt-6 text-pretty text-lg font-medium  sm:text-xl/8'>
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button asChild>
              <Link to='/'>Go back home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold '>500</p>
          <h1 className='mt-4 text-balance text-5xl font-semibold tracking-wide  sm:text-7xl'>
            <i>Something went wrong.</i>
          </h1>
          <p className='mt-6 text-pretty text-lg font-medium  sm:text-xl/8'>
            Sorry, we couldn’t process your request. Please try again later.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button asChild>
              <Link to='/'>Go back home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
}
