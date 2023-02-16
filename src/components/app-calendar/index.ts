import createElement from '../../utils/createElement';

class AppCalendar extends HTMLElement {
  static MONTH_NAMES_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  static MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  static DAYS_NAMES_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  static DAYS_NAMES_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  private today: Date;

  private classNamePrefix: string;

  private daysNames: string[];

  private monthsNames: string[];

  private value: Date;

  private currentDate: {
    date: string;
    month: string;
    year: string;
  };

  constructor() {
    super();
    this.today = new Date();
    this.classNamePrefix = this.getAttribute('class-prefix') || 'calendar';
    this.daysNames = this.getAttribute('lang') === 'en' ? AppCalendar.DAYS_NAMES_EN : AppCalendar.DAYS_NAMES_RU;
    this.monthsNames = this.getAttribute('lang') === 'en' ? AppCalendar.MONTH_NAMES_EN : AppCalendar.MONTH_NAMES_RU;
    this.setAttribute('class', `${this.classNamePrefix}`);
    this.currentDate = {
      date: this.today.getDate().toString(),
      month: this.today.getMonth().toString(),
      year: this.today.getFullYear().toString(),
    };
    this.value = new Date();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        // .${this.classNamePrefix} {
        //   position: absolute;
        //   top: 50%;
        //   z-index: 1000;
        // }
        .${this.classNamePrefix}__date-button {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      <div>
        <button class="${this.classNamePrefix}__months-btn" id="${this.classNamePrefix}-show-months">${this.getMonthName(this.today.getMonth())}</button>
        <button class="${this.classNamePrefix}__years-btn" id="${this.classNamePrefix}-show-years">${this.today.getFullYear()}</button>
      </div>
      <div class="${this.classNamePrefix}__btns-wrapper" id="${this.classNamePrefix}-btns"></div>
    `;
    // <div class="${this.classNamePrefix}__dates-wrapper" id="${this.classNamePrefix}-dates"></div>
    // <div class="${this.classNamePrefix}__months-wrapper" id="${this.classNamePrefix}-months"></di
    // <div class="${this.classNamePrefix}__years-wrapper" id="${this.classNamePrefix}-years"></div>
    this.createCalendar();
  }

  private createCalendar(): void {
    const yearsBtn = this.querySelector(`#${this.classNamePrefix}-show-years`) as HTMLButtonElement;
    const monthsBtn = this.querySelector(`#${this.classNamePrefix}-show-months`) as HTMLButtonElement;

    yearsBtn.onclick = () => {
      this.renderYears();
    };
    monthsBtn.onclick = () => {
      this.renderMonths();
    };
    this.renderDates();
  }

  private renderYears() {
    const yearsWrapper = this.querySelector(`#${this.classNamePrefix}-btns`) as HTMLDivElement;
    yearsWrapper.innerHTML = '';
    const years = [
      ...this.getPrevYears(+this.currentDate.year),
      +this.currentDate.year,
      ...this.getNextYears(+this.currentDate.year)];

    const yearsBtns = years.map((yearValue) => this.getButton(
      yearValue.toString(),
      yearValue === this.today.getFullYear() ? 'active' : 'normal',
      this.setYear.bind(this),
    ));
    this.renderTable(yearsWrapper, ['', '', '', '', ''], yearsBtns);
  }

  private setYear(value: string) {
    this.currentDate.year = value;
    const yearsBtn = this.querySelector(`#${this.classNamePrefix}-show-years`) as HTMLButtonElement;
    yearsBtn.textContent = value;
    this.renderMonths();
  }

  private renderMonths() {
    const monthsWrapper = this.querySelector(`#${this.classNamePrefix}-btns`) as HTMLDivElement;
    monthsWrapper.innerHTML = '';
    const monthsBtns = this.monthsNames.map((monthName) => this.getButton(
      monthName,
      monthName === this.getMonthName(this.today.getMonth())
        && Number(this.currentDate.year) === this.today.getFullYear() ? 'active' : 'normal',
      this.setMonth.bind(this),
    ));
    this.renderTable(monthsWrapper, ['', '', ''], monthsBtns);
  }

  private setMonth(value: string) {
    const monthIdx = this.monthsNames.indexOf(value);
    this.currentDate.month = monthIdx.toString();
    const monthsBtn = this.querySelector(`#${this.classNamePrefix}-show-months`) as HTMLButtonElement;
    monthsBtn.textContent = value;
    this.renderDates();
  }

  private renderDates() {
    const datesWrapper = this.querySelector(`#${this.classNamePrefix}-btns`) as HTMLDivElement;
    datesWrapper.innerHTML = '';
    const { month, year } = this.currentDate;
    this.renderTable(datesWrapper, this.daysNames, this.getTableData(month, year));
  }

  private renderTable(parent: HTMLDivElement, headers: string[], data: HTMLButtonElement[]) {
    const parentElement = parent;

    parentElement.innerHTML = '';
    if (headers) {
      const headersRow = createElement('thead', parentElement) as HTMLTableRowElement;
      headers.forEach((header) => {
        createElement('th', headersRow, undefined, header);
      });
    }
    if (data) {
      let tr: HTMLTableRowElement;
      let j = 1;
      data.forEach((el) => {
        if (j > headers.length) j = 1;
        if (j === 1) tr = createElement('tr', parentElement) as HTMLTableRowElement;
        const td = createElement('td', tr) as HTMLTableRowElement;
        td.appendChild(el);
        j += 1;
      });
    }
  }

  private getTableData(month: string, year: string): HTMLButtonElement[] {
    const lastDayOfMonth = this.getLastDateOfMonth(+month, +year);
    const firstWeekDayOfMonth = this.getWeekDayOfMonth(+year, +month, 1);
    const lastWeekDayOfMonth = this.getWeekDayOfMonth(+year, +month, lastDayOfMonth);
    const lastDateOfPrevMonth = this.getLastDateOfMonth(+year, (+month - 1));
    const datesBefore = this.getDatesBefore(firstWeekDayOfMonth, lastDateOfPrevMonth);
    const datesAfter = this.getDatesAfter(lastWeekDayOfMonth);
    const datesThisMonth = this.getDatesThisMonth(lastDayOfMonth);
    const datesBeforeBtns = datesBefore.map((dateValue) => this.getButton(`${dateValue}`, 'disabled'));
    const datesAftereBtns = datesAfter.map((dateValue) => this.getButton(`${dateValue}`, 'disabled'));

    const datesThisMonthBtns = datesThisMonth.map((dateValue) => this.getButton(
      `${dateValue}`,
      dateValue === this.today.getDate()
        && Number(month) === this.today.getMonth()
        && Number(year) === this.today.getFullYear() ? 'active' : 'normal',
      this.setDate.bind(this),
    ));

    return [...datesBeforeBtns, ...datesThisMonthBtns, ...datesAftereBtns];
  }

  private setDate(value: string) {
    this.currentDate.date = value;
    const { date, month, year } = this.currentDate;
    this.value = new Date(+year, +month, +date);
    const ev = new Event('input');
    this.dispatchEvent(ev);
  }

  private getLastDateOfMonth(month: number, year: number): number {
    const date = new Date(+year, (Number(month) + 1), 0);
    return date.getDate();
  }

  private getWeekDayOfMonth(year: number, month: number, date: number): number {
    const weekDay = new Date(year, month, date);
    return weekDay.getDay() === 0 ? 7 : weekDay.getDay();
  }

  private getDatesBefore(firstDayOfweek: number, lastDate: number): number[] {
    const arr = [];
    let date = lastDate;
    for (let i = firstDayOfweek - 1; i >= 1; i -= 1) {
      // let btn = new Component(null, 'button', 'btn-disabled', date--);
      // btn.node.setAttribute('disabled', 'disabled')
      arr.push(date);
      date -= 1;
    }
    return arr.reverse();
  }

  private getDatesAfter(lastDayOfweek: number): number[] {
    const arr = [];
    console.log('datesAfter', lastDayOfweek);
    let date = 1;
    for (let i = Number(lastDayOfweek) + 1; i <= 7; i += 1) {
      // let btn = new Component(null, 'button', 'btn-disabled', date++);
      // btn.node.setAttribute('disabled', 'disabled')
      arr.push(date);
      date += 1;
    }
    return arr;
  }

  private getDatesThisMonth(lastDayOfMonth: number): number[] {
    const arr = [];
    const date = 1;
    for (let i = date; i <= lastDayOfMonth; i += 1) {
      arr.push(i);
    }
    return arr;
  }

  private getNextYears(currentYear: number) {
    const arr = [];
    for (let i = currentYear + 1; i <= currentYear + 12; i += 1) {
      arr.push(i);
    }
    return arr;
  }

  private getPrevYears(currentYear: number) {
    const arr = [];
    for (let i = currentYear - 1; i >= currentYear - 12; i -= 1) {
      arr.push(i);
    }
    return arr.reverse();
  }

  private getMonthName(monthNum: number) {
    return this.monthsNames[monthNum];
  }

  private getButton(value: string, type: string, callback?: (value: string) => void) {
    const button = createElement('button', undefined, {
      class: `${this.classNamePrefix}__date-button`,
    }, value) as HTMLButtonElement;
    if (type === 'disabled') {
      button.classList.add('class', `${this.classNamePrefix}__date-button_disabled`);
      button.disabled = true;
    }
    if (type === 'active') {
      button.classList.add('class', `${this.classNamePrefix}__date-button_active`);
    }
    if (callback) {
      button.onclick = () => {
        callback(value);
      };
    }
    return button;
  }
}

customElements.define('app-calendar', AppCalendar);
