// import api from '../api';
import router from '../router';
import state from '../store/state';

const logout = async () => {
  // const userId = state.user?.id as string;
  // const logoutResult = await api.auth.logout(userId);

  // if (!logoutResult.success) return;
  state.isAuthorized = false;
  state.user = undefined;
  state.currentPage = 'Main';
  state.activeBoardId = '';
  router.goTo('/');
};

const authService = {
  logout,
};

export default authService;
