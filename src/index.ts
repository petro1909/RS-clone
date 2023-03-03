import router from './router';
import state from './store/state';
import './components';
import './styles/main.scss';

const storeData = localStorage.getItem('state');

if (storeData) {
  const stateData = JSON.parse(storeData);

  if (stateData.token) {
    state.token = stateData.token;
    state.isAuthorized = true;
    state.user = stateData.user;
    state.activeBoardId = stateData.activeBoardId;
  }
}

router.start();

window.addEventListener('beforeunload', () => {
  if (state.isAuthorized) {
    localStorage.setItem('state', JSON.stringify(state));
  }
});
