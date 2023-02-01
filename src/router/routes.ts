import MainPage from '../pages/Main';
import UserPage from '../pages/User/inedx';
import NotFoundPage from '../pages/NotFound';

const routes = [
  { path: '/', title: 'Home', page: new MainPage() },
  { path: '/user', title: 'User', page: new UserPage() },
  { path: '/404', title: 'User', page: new NotFoundPage() },
];

export default routes;
