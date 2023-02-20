import settings from '../store/settings';
import { IUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/administration`;

const deleteUser = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/users/${id}`, 'DELETE');

const admin = {
  deleteUser,
};

export default admin;
