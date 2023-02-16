import settings from '../store/settings';
import baseFetch from './baseFetch';
import { Ilogin, IRegisterUser, IUser } from '../types';

const ENDPOINT = `${settings.SERVER}/users`;

const getUserByEmail = async (email: string) => baseFetch(`${ENDPOINT}/?email=${email}`, 'GET');

const register = async (registerUser: IRegisterUser) => baseFetch<IRegisterUser>(`${ENDPOINT}/register`, 'POST', JSON.stringify(registerUser));

const login = async (loginUser: Ilogin) => baseFetch<{ findedUser: IUser, token: string }>(`${ENDPOINT}/login`, 'POST', JSON.stringify(loginUser));

const logout = async (userId: string) => baseFetch(`${ENDPOINT}/logout/${userId}`, 'GET');

const auth = {
  login,
  getUserByEmail,
  register,
  logout,
};

export default auth;
