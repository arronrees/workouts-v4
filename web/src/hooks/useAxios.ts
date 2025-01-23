import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

interface ApiResponse<ResponseData> {
  success: boolean;
  error?: string;
  data?: ResponseData;
}

const useAxios = <ResponseData>(
  config: AxiosRequestConfig
): {
  isLoading: boolean;
  error: string | null;
  data: ApiResponse<ResponseData> | null;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse<ResponseData> | null>(null);

  useEffect(() => {
    return;
    if (!config) return;

    const fetchData = () => {
      setIsLoading(true);

      axios(config)
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
    };

    fetchData();
  }, [config]);

  return { isLoading, error, data };
};

export default useAxios;
