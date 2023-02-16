import state from '../store/state';

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
  // const token = window.sessionStorage.getItem('app-token');
  const { token } = state;
  // const boundary = String(Math.random()).slice(2);
  // const boundaryMiddle = `--${boundary}\r\n`;
  // const boundaryLast = `--${boundary}--\r\n`;
  const fetchOptions: IFetchOptions = {
    method,
    headers: {},
    // headers: {
    //   'Content-Type': 'multipart/form-data', // 'application/json',
    // },
  };

  if (!body || (typeof body === 'string')) {
    fetchOptions.headers['Content-Type'] = 'application/json';
  }

  // if (body instanceof FormData) {
  //   // fetchOptions.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
  //   fetchOptions.body = body;
  // }

  if (token) {
    // fetchOptions.headers.Authorization = `Bearer ${token}`;
    fetchOptions.headers.Authorization = `${token}`;
  }
  // console.log('BODY', body);
  // console.log('FORMDATA', body.get('profile') as FormData);
  if (body) fetchOptions.body = body;
  // if (body) fetchOptions = Object.assign(fetchOptions, { body });

  try {
    const res = await fetch(endpoint, fetchOptions);
    result.success = !!res.ok;
    if (res.ok && fetchOptions.method !== 'DELETE') { // 204 status?
      const data: T = await res.json();
      result.data = data;
    } else {
      console.log('RES', res);
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

export default baseFetch;
