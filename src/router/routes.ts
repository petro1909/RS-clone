import MainPage from '../pages/Main';
import UserPage from '../pages/User/inedx';
import AdminPage from '../pages/Admin/index';
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
    path: '/admin', title: 'Admin', isAuthorized: true, page: new AdminPage(),
  },
  {
    path: '/board', title: 'Board', isAuthorized: true, page: new BoardPage(),
  },
  {
    path: '/404', title: '404', isAuthorized: false, page: new NotFoundPage(),
  },
];

export default routes;
