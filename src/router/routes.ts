import MainPage from '../pages/Main';
import UserPage from '../pages/User/inedx';
import NotFoundPage from '../pages/NotFound';
import BoardPage from '../pages/Board';

const routes = [
  {
    path: '/', title: 'Home', isAuthorized: false, page: new MainPage(),
  },
  {
    path: '/user', title: 'User', isAuthorized: true, page: new UserPage(),
  },
  {
    path: '/board', title: 'Board', isAuthorized: true, page: new BoardPage(),
  },
  {
    path: '/404', title: '404', isAuthorized: false, page: new NotFoundPage(),
  },
];

export default routes;
