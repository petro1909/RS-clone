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
    if (res.ok) {
      const data: T = await res.json();
      result.success = true;
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
