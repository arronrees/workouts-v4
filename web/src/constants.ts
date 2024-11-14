import axios from 'axios';
import { User } from './constant.types';
import { redirect } from 'react-router-dom';

export const API_URL = import.meta.env.VITE_API_URL;

export async function getUser(): Promise<User | null> {
  try {
    const { data } = await axios.get(`${API_URL}/api/user/me`, {
      withCredentials: true,
    });

    if (data) {
      return data.data as User;
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function signOutAction() {
  await axios.delete(`${API_URL}/api/auth/signout`, { withCredentials: true });

  return redirect('/signin');
}