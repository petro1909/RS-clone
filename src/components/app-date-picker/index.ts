import createElement from '../../utils/createElement';
import convertTimeForDateInput from '../../utils/convertTimeForDateInput';

class AppDatePicker extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<app-calendar id="calendar-picker"><app-calendar>';
    const dateInput = createElement('input', this, {
      type: 'date',
    }) as HTMLInputElement;
    dateInput.onclick = () => {
      console.log(dateInput.value);
    };
    const picker = this.querySelector('#calendar-picker') as HTMLInputElement;
    picker?.addEventListener('input', () => {
      console.log('DATE INPUT', picker.value);
      const dateValue = picker.value as unknown as Date;
      dateInput.value = convertTimeForDateInput(dateValue);
    });
    const mainInput = createElement('input', this, {
      type: 'text',
    }) as HTMLInputElement;
    mainInput.oninput = (e) => {
      const ev = e as InputEvent;
      console.log(dateInput.value);
      this.watchMainInput(ev);
    };
  }

  watchMainInput(e: InputEvent) {
    const symbol = '/';
    const { inputType } = e;
    const input = e.target as HTMLInputElement;

    if (e.target) {
      if (input.value.length === 1 && (+input.value < 0 || +input.value > 3)) {
        input.value = '';
      } else if (input.value.length === 2 && (+input.value > 31)) {
        input.value = input.value.slice(0, 1);
      } else if (input.value.length === 4 && (+input.value[3] > 1)) {
        input.value = input.value.slice(0, 3);
      } else if (input.value.length === 5 && (+input.value.slice(-2) > 12)) {
        input.value = input.value.slice(0, -1);
      } else if (input.value.length === 7 && (+input.value.slice(-1) > 2)) {
        input.value = input.value.slice(0, -1);
      } else if (input.value.length === 8 && (+input.value.slice(-2) > 20)) {
        input.value = input.value.slice(0, -1);
      } else if (input.value.length === 9 && (+input.value.slice(-3) > 203)) {
        input.value = input.value.slice(0, -1);
      } else if (input.value.length === 10 && (+input.value.slice(-4) > 2039)) {
        input.value = input.value.slice(0, -1);
      }

      if (input.value.length === 2 || input.value.length === 5) {
        input.value = inputType === 'deleteContentBackward'
          ? input.value.split(symbol)[0]
          : input.value + symbol;
      } else if (input.value.length > 9) {
        input.value = input.value.slice(0, 10);
      }
    }
  }
}

customElements.define('date-picker', AppDatePicker);
