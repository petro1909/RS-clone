import state from '../store/state';
import routes from './routes';

class Router {
  private loadPage(): void {
    const urlPathname = window.location.pathname;
    const correctRoutes = routes.filter((route) => route.path === urlPathname);
    console.log('ISAUTH', state.isAuthorized);

    if (correctRoutes.length < 1) {
      this.goTo('/404');
      return;
    }
    const [correctRoute] = correctRoutes;

    if (correctRoute.isAuthorized && !state.isAuthorized) {
      this.goTo('/');
    } else {
      const currRoute = correctRoutes[0];
      document.body.innerHTML = '';
      currRoute.page.render();
    }
  }

  goTo(href: string): void {
    window.history.pushState('', '', href);
    this.loadPage();
  }

  start(): void {
    window.addEventListener('popstate', () => (
      this.loadPage()
    ));
    window.addEventListener('DOMContentLoaded', () => (
      this.loadPage()
    ));

    window.addEventListener('click', (e) => {
      if (!e.target) return;
      const target = e.composedPath()[0] as HTMLElement;
      const link = target.closest('a');
      if (link?.matches('[data-local-link]')) {
        e.preventDefault();
        this.goTo(link.href);
      }
    });
  }
}

const router = new Router();
export default router;
