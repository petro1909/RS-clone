import appEvent from '../events';
import ApiError from './ApiError';

const errorHandler = (error: Error) => {
  if (error instanceof TypeError) {
    const ev = appEvent.showMessage({
      type: 'error',
      text: 'Service unavailable',
      statusCode: 1,
      details: error.message,
    });
    window.dispatchEvent(ev);
  }
  if (error instanceof ApiError) {
    const ev = appEvent.showMessage({
      type: 'error',
      text: error.name,
      statusCode: error.code,
      details: error.message,
    });
    window.dispatchEvent(ev);
  }
};

export default errorHandler;
