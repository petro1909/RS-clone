interface IFetchOptions {
  method: string,
  headers: {
    [key: string]: string,
  }
  body?: string,
}

interface IAPIResponse<T> {
  success: boolean,
  data?: T
}

const baseFetch = async <T>(
  endpoint: string, method: string, body?: string,
): Promise<IAPIResponse<T>> => {
  const result = {} as IAPIResponse<T>;
  const token = window.sessionStorage.getItem('app-token');
  const fetchOptions: IFetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`;
  }
  if (body) fetchOptions.body = body;

  try {
    const res = await fetch(endpoint, fetchOptions);
    result.success = !!res.ok;
    if (res.ok && fetchOptions.method !== 'DELETE') { // 204 status?
      const data: T = await res.json();
      result.data = data;
    } else {
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

export default baseFetch;
