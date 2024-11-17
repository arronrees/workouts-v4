import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../constants';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
import { Workout } from '../../constant.types';
import { Link } from 'react-router-dom';

export default function WorkoutTable() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['workouts'],
    queryFn: (): Promise<{ success: boolean; data: Workout[] }> =>
      axios
        .get(`${API_URL}/api/workouts`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <ScaleLoader color='#A3DCA1' height={32} />
      </div>
    );
  }

  if (isError) {
    console.log(error.message);

    return (
      <p className='bg-red-200 text-sm p-4'>
        There was an error fetching your workouts, please try again.
      </p>
    );
  }

  return (
    <table>
      <thead>
        <tr className='text-green-mid font-normal'>
          <th>Name</th>
          <th>No. of Exercises</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data?.data &&
          data?.data.map((workout) => (
            <tr key={workout.id}>
              <td>
                <Link
                  to={`/workouts/${workout.id}`}
                  className='hover:font-semibold'
                >
                  {workout.name}
                </Link>
              </td>
              <td>{workout.exercises.length}</td>
              <td>
                <Link
                  to={`/workouts/${workout.id}/record`}
                  className='btn--secondary ml-auto'
                >
                  Start
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
