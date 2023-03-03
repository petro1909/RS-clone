import state from '../store/state';
import errorHandler from '../services/errorHandler';
import ApiError from '../services/ApiError';

interface IFetchOptions {
  method: string,
  headers: {
    [key: string]: string,
  }
  body?: string | FormData,
}

interface IAPIResponse<T> {
  success: boolean,
  data?: T
}

const baseFetch = async <T>(
  endpoint: string, method: string, body?: string | FormData,
): Promise<IAPIResponse<T>> => {
  const result = {} as IAPIResponse<T>;
  const { token } = state;
  const fetchOptions: IFetchOptions = {
    method,
    headers: {},
  };

  if (!body || (typeof body === 'string')) {
    fetchOptions.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    fetchOptions.headers.Authorization = `${token}`;
  }

  if (body) fetchOptions.body = body;

  try {
    const res = await fetch(endpoint, fetchOptions);
    result.success = !!res.ok;
    if (res.ok && fetchOptions.method !== 'DELETE') {
      const data: T = await res.json();
      result.data = data;
    } else {
      const data = await res.json();
      throw new ApiError(data.message, res.status);
    }
  } catch (error) {
    const err = error as Error;
    errorHandler(err);
  }
  return result;
};

export default baseFetch;
