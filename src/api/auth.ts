import settings from '../store/settings';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/users`;

const getUserByEmail = async (email: string) => baseFetch(`${ENDPOINT}/?email=${email}`, 'GET');

const auth = {
  login: getUserByEmail,
};

export default auth;
