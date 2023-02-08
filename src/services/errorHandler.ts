import appEvent from '../events';

const errorHandler = (error: Error) => {
  if (error instanceof TypeError) {
    console.log('Ошибка подключения к серверу', error.message);
    const ev = appEvent.showMessage({
      type: 'error',
      text: 'Service unavailable',
      statusCode: 1,
      details: error.message,
    });
    window.dispatchEvent(ev);
  }
};

export default errorHandler;
