import createElement from '../../utils/createElement';
import convertTimeForDateInput from '../../utils/convertTimeForDateInput';

class AppDatePicker extends HTMLElement {
  private val: string;

  private globalClickHandler: (e: Event) => void;

  constructor() {
    super();
    this.val = '';
    this.globalClickHandler = this.closeCalendar.bind(this);
  }

  connectedCallback() {
    this.innerHTML = `<style>
        .app-date-picker {
          position: relative;
        }

        .app-date-picker app-calendar {
          position: absolute;
          bottom: -282px;
          right: 0;
          min-width: 295px;
          min-height: 280px;
        }

        .app-date-picker__calendar-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          z-index: 100;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .app-date-picker__calendar-btn svg.st0 {
          fill: rgba(0, 0, 0, .5)
        }
      </style>
      <app-calendar id="${this.id}-cal" lang="en_sm" class-prefix="picker-calendar"></app-calendar>
    `;
    this.classList.add('app-date-picker');

    const picker = this.querySelector('#calendar-picker') as HTMLInputElement;
    const mainInput = createElement('input', this, {
      type: 'text',
    }) as HTMLInputElement;
    mainInput.id = `${this.id}-input`;
    mainInput.oninput = (e) => {
      const ev = e as InputEvent;
      this.watchMainInput(ev);
    };
    picker?.addEventListener('input', () => {
      const dateValue = picker.value as unknown as Date;
      this.val = convertTimeForDateInput(dateValue);
      const mainInputValue = convertTimeForDateInput(dateValue);
      mainInput.value = mainInputValue.split('-').reverse().join('/');
      const ev = new Event('input');
      this.dispatchEvent(ev);
    });
    this.renderCalendarBtn();
    window.addEventListener('click', this.globalClickHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.globalClickHandler);
  }

  public get value(): string {
    return this.val;
  }

  public set value(v: string) {
    const mainInput = this.querySelector(`#${this.id}-input`) as HTMLInputElement;
    const newValue = v.split('-').reverse().join('/');

    this.val = newValue;
    mainInput.value = newValue;
  }

  renderCalendarBtn() {
    const calendarBtn = createElement('button', this, {
      class: 'app-date-picker__calendar-btn',
      id: `${this.id}-btn`,
    }, `
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 926.3 926.3" style="enable-background:new 0 0 926.3 926.3;" xml:space="preserve">
//  <style type="text/css">
//    .st0{fill:#67605B;}
//  </style>
 <g>
   <path class="st0" d="M577.9,375.1h-57.8c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C602.9,386.2,591.7,375.1,577.9,375.1z"/>
   <path class="st0" d="M749.7,375.1h-57.8c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C774.7,386.2,763.5,375.1,749.7,375.1z"/>
   <path class="st0" d="M236,705.8h-57.9c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C261,717,249.8,705.8,236,705.8z"/>
   <path class="st0" d="M407.8,705.8H350c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C432.8,717,421.6,705.8,407.8,705.8z"/>
   <path class="st0" d="M176.5,648h57.8c13.8,0,25-11.2,25-25v-57.8c0-13.8-11.2-25-25-25h-57.8c-13.8,0-25,11.2-25,25V623
     C151.5,636.8,162.7,648,176.5,648z"/>
   <path class="st0" d="M348.3,648h57.8c13.8,0,25-11.2,25-25v-57.8c0-13.8-11.2-25-25-25h-57.8c-13.8,0-25,11.2-25,25V623
     C323.3,636.8,334.5,648,348.3,648z"/>
   <path class="st0" d="M577.9,540.1h-57.8c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C602.9,551.3,591.7,540.1,577.9,540.1z"/>
   <path class="st0" d="M749.7,540.1h-57.8c-13.8,0-25,11.2-25,25v57.8c0,13.8,11.2,25,25,25h57.8c13.8,0,25-11.2,25-25v-57.8
     C774.7,551.3,763.5,540.1,749.7,540.1z"/>
   <g>
     <path class="st0" d="M31,926.3h864.3c13.8,0,25-11.2,25-25V100.2c0-13.8-11.2-25-25-25h-88.8v87.1c0,30.3-24.7,55-55,55h-61.2
       c-30.3,0-55-24.7-55-55V75.2h-86.6v87.1c0,30.3-24.7,55-55,55h-61.2c-30.3,0-55-24.7-55-55V75.2h-86.6v87.1c0,30.3-24.7,55-55,55
       h-61.2c-30.3,0-55-24.7-55-55V75.2H31c-13.8,0-25,11.2-25,25v801.1C6,915.1,17.2,926.3,31,926.3z M70.3,328.2h785.6V862H70.3
       V328.2z"/>
     <path class="st0" d="M174.8,0c-13.8,0-25,11.2-25,25v50.1v87.1c0,13.8,11.2,25,25,25H236c13.8,0,25-11.2,25-25V75.1V25
       c0-13.8-11.2-25-25-25H174.8z"/>
     <path class="st0" d="M432.5,0c-13.8,0-25,11.2-25,25v50.1v87.1c0,13.8,11.2,25,25,25h61.2c13.8,0,25-11.2,25-25V75.1V25
       c0-13.8-11.2-25-25-25H432.5z"/>
     <path class="st0" d="M751.4,0h-61.2c-13.8,0-25,11.2-25,25v50.1v87.1c0,13.8,11.2,25,25,25h61.2c13.8,0,25-11.2,25-25V75.1V25
       C776.4,11.2,765.2,0,751.4,0z"/>
   </g>
 </g>
 </svg>
    `) as HTMLButtonElement;
    const picker = this.querySelector(`#${this.id}-cal`) as HTMLInputElement;
    calendarBtn.onclick = (e) => {
      e.preventDefault();
      calendarBtn.classList.toggle('app-date-picker__calendar-btn_active');
      picker.classList.toggle('element--invisible');
    };
  }

  private closeCalendar(e: Event) {
    const picker = document.querySelector(`#${this.id}-cal`) as HTMLInputElement;
    const calendarBtn = document.querySelector(`#${this.id}-btn`) as HTMLElement;
    const elems = e.composedPath() as HTMLElement[];
    const elPicker = picker as HTMLElement;
    const elBtn = calendarBtn as HTMLElement;
    if (!elems.includes(elPicker) && !elems.includes(elBtn)) {
      picker.classList.add('element--invisible');
    }
  }

  private watchMainInput(e: InputEvent) {
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

      if (input.value.length === 10) {
        const value = input.value.split('/').reverse().join('-');
        this.val = value;
        const ev = new Event('input');
        this.dispatchEvent(ev);
      }
    }
  }
}

customElements.define('date-picker', AppDatePicker);
