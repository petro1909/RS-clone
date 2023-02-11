import settings from '../store/settings';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/users`;

const getUserByEmail = async (email: string) => baseFetch(`${ENDPOINT}/?email=${email}`, 'GET');

const logout = async (userId: string) => baseFetch(`${ENDPOINT}/logout/${userId}`, 'GET');

const auth = {
  login: getUserByEmail,
  logout,
};

export default auth;
