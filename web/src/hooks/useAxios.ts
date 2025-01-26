import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface IApiResponse<Data> {
  success: boolean;
  error?: string;
  data?: Data;
}

const useAxios = <Data>(
  config: AxiosRequestConfig
): {
  isLoading: boolean;
  error: string | null;
  data: IApiResponse<Data> | null;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IApiResponse<Data> | null>(null);

  const fetchData = useCallback(() => {
    if (!config) return;

    setIsLoading(true);

    axios({ ...config, withCredentials: true })
      .then((res) => {
        setData(res.data);
      })
      .catch((err: AxiosError) => {
        if (err instanceof AxiosError) {
          setError(err.message);
        } else {
          setError('Error making request');
        }
      })
      .finally(() => setIsLoading(false));
  }, [config]);

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, error, data };
};

export default useAxios;
