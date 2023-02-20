import createElement from '../../utils/createElement';
import './index.scss';

const createInputButton = (parent: HTMLElement, callback: (value: string) => void, options: {
  buttonName: string,
  buttonClassName: string,
  inputClassName: string
}) => {
  const wrapper = createElement('div', parent, {
    class: 'inputButton__wrapper',
  }) as HTMLDivElement;
  const mainButton = createElement('button', wrapper, {
    class: `${options.buttonClassName} inputButton__main-button`,
  }, options.buttonName) as HTMLButtonElement;
  const inputWrapper = createElement('div', wrapper, {
    class: 'inputButton__input-wrapper',
    type: 'text',
  }) as HTMLDivElement;
  const input = createElement('input', inputWrapper, {
    class: options.inputClassName,
    type: 'text',
  }) as HTMLInputElement;
  const submitButton = createElement('button', inputWrapper, {
    class: 'inputButton__input-submit',
  }, '☑') as HTMLButtonElement;

  inputWrapper.style.display = 'none';

  mainButton.onclick = () => {
    mainButton.style.display = 'none';
    inputWrapper.style.display = 'block';
    input.focus();
  };

  const submit = () => {
    if (input.value.trim()) {
      const newValue = input.value.trim();
      input.disabled = true;
      input.value = 'Saving...';
      mainButton.disabled = true;
      submitButton.disabled = true;
      callback(newValue);
      // this.addNewBoard(newValue);
    } else {
      mainButton.style.display = 'block';
      inputWrapper.style.display = 'none';
    }
  };

  input.onkeydown = (e) => {
    const ev = e as KeyboardEvent;
    if (ev.key === 'Enter') submit();
  };
  // input.onblur = submit;
  submitButton.onclick = submit;
};

export default createInputButton;
