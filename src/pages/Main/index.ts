import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';

class MainPage {
  render(): void {
    console.log('render() MainPage');
    document.title = 'Main Page';
    document.body.classList.add('body-scrollbar--invisible');
    document.body.innerHTML = `
      <app-header></app-header>
      ${template}
      <app-footer></app-footer>`;
    document.querySelector('.user-menu__login')?.addEventListener('click', () => {
      if (!state.isAuthorized) {
        createElement('login-form', document.body);
        document.body.classList.add('overflow-hidden');
      }
    });
    this.renderScroll3D();
  }

  renderScroll3D(): void {
    console.log('renderScroll3D()');
    const zAxisSpacing = -1000;
    let lastPos = zAxisSpacing / 5;
    const $frames: HTMLCollectionOf<Element> = document.getElementsByClassName('frame');
    const frames: Element[] = Array.from($frames);
    const zAxisVals: number[] = [];
    (() => {
      const top = document.documentElement.scrollTop;
      const delta = lastPos - top;
      lastPos = top;
      frames.forEach((fr, i) => {
        zAxisVals.push((i * zAxisSpacing) + zAxisSpacing);
        zAxisVals[i] += delta * -5.5;
        const frame = frames[i];
        const transform = `translateZ(${zAxisVals[i]}px)`;
        const opacity = zAxisVals[i] < Math.abs(zAxisSpacing) / 1.8 ? 1 : 0;
        frame.setAttribute('style', `transform: ${transform}; opacity: ${opacity}`);
      });
    })();
    window.onscroll = () => {
      const top = document.documentElement.scrollTop;
      const delta = lastPos - top;
      lastPos = top;
      frames.forEach((fr, i) => {
        zAxisVals.push((i * zAxisSpacing) + zAxisSpacing);
        zAxisVals[i] += delta * -5.5;
        const frame = frames[i];
        const transform = `translateZ(${zAxisVals[i]}px)`;
        const opacity = zAxisVals[i] < Math.abs(zAxisSpacing) / 1.8 ? 1 : 0;
        frame.setAttribute('style', `transform: ${transform}; opacity: ${opacity}`);
      });
    };
    window.scrollTo(0, 1);
  }
}

export default MainPage;
