// import api from '../api';
import router from '../router';
import state from '../store/state';
import { IUser, IRegisterUser, Ilogin } from '../types';
import api from '../api';

const setStateUser = async (user: IUser, token: string) => {
  state.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePicture: '',
    role: user.role,
  };
  state.isAuthorized = true;
  state.token = token;

  if (user.profilePicture) {
    const avatarRes = await api.users.getAvatar(user.id);

    if (avatarRes.data) {
      state.user.profilePicture = avatarRes.data.profilePicture;
    }
  }
  if (state.currentPage === 'Admin') {
    router.goTo('/admin');
  } else {
    router.goTo('/board');
  }
};

const login = async (loginData: Ilogin) => {
  const res = await api.auth.login(loginData);

  if (res.success) {
    const user = res.data?.findedUser as IUser;
    const token = res.data?.token as string;
    setStateUser(user, token);
  }
};

const register = async (registerUser: IRegisterUser) => {
  const result = await api.users.create(registerUser);
  if (result.success) {
    login({ email: registerUser.email, password: registerUser.password });
  }
};

const logout = async () => {
  state.isAuthorized = false;
  state.user = undefined;
  state.currentPage = 'Main';
  state.activeBoardId = '';
  localStorage.removeItem('state');
  router.goTo('/');
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
