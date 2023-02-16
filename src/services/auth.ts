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

  if (user.profilePicture) {
    const avatarRes = await api.users.getAvatar(user.id);
    if (avatarRes.data) {
      state.user.profilePicture = avatarRes.data.url;
    }
  }
  state.isAuthorized = true;
  state.token = token;
  router.goTo('/board');
};

// const login = async (loginData: Ilogin) => {
//   console.log(loginData);
//   const res = await api.auth.login('email12@gmail.com');
//   if (res.success) {
//     const [user] = res.data as IUser[];
//     setStateUser(user);
//     // state.user = user;
//     // state.isAuthorized = true;
//     // router.goTo('/board');
//   }
//   // router.goTo('/board');
// };

const login = async (loginData: Ilogin) => {
  console.log(loginData);
  const res = await api.auth.login({ email: 'admin@mail.ru', password: '1234' });
  if (res.success) {
    console.log('data', res.data);
    const user = res.data?.findedUser as IUser;
    const token = res.data?.token as string;
    setStateUser(user, token);
    console.log('user', user);
    console.log('token', token);
    // router.goTo('/board');
  }
  // if (res.success) {
  //   const [user] = res.data as IUser[];
  //   setStateUser(user);
  //   // state.user = user;
  //   // state.isAuthorized = true;
  //   // router.goTo('/board');
  // }
  // router.goTo('/board');
};

const register = async (registerUser: IRegisterUser) => {
  const result = await api.users.create(registerUser);
  if (result.success) {
    // const user = result.data as unknown as IUser;
    login({ email: registerUser.email, password: registerUser.password });
    // setStateUser(user);

    // state.user = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   profilePicture: user.profilePicture || '',
    //   role: user.role,
    // };
    // router.goTo('/board');
  }
};

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
  login,
  register,
  logout,
};

export default authService;
