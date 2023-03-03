import createElement from '../../utils/createElement';

interface IMonthNames {
  [key: string]: string[]
}

class AppCalendar extends HTMLElement {
  static MONTH_NAMES: IMonthNames = {
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    ru_sm: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    en_sm: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };

  static DAYS_NAMES = {
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  };

  private today: Date;

  private classNamePrefix: string;

  private daysNames: string[];

  private monthsNames: string[];

  private value: Date;

  public currentDate: {
    date: string;
    month: string;
    year: string;
  };

  constructor() {
    super();
    this.today = new Date();
    this.classNamePrefix = this.getAttribute('class-prefix') || 'calendar';
    this.daysNames = this.getAttribute('lang') === 'en' || this.getAttribute('lang') === 'en_sm' ? AppCalendar.DAYS_NAMES.en : AppCalendar.DAYS_NAMES.ru;
    const langKey = this.getAttribute('lang') as string;
    this.monthsNames = AppCalendar.MONTH_NAMES[langKey || 'ru'];
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
        .${this.classNamePrefix}__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      </style>
      <div class="${this.classNamePrefix}__header">
        <button class="${this.classNamePrefix}__header-btn" id="${this.classNamePrefix}-prev-btn"><</button>
        <div class="${this.classNamePrefix}__header-center">
          <button class="${this.classNamePrefix}__months-btn" id="${this.classNamePrefix}-show-months">${this.getMonthName(this.today.getMonth())}</button>
          <button class="${this.classNamePrefix}__years-btn" id="${this.classNamePrefix}-show-years">${this.today.getFullYear()}</button>
        </div>
        <button class="${this.classNamePrefix}__header-btn" id="${this.classNamePrefix}-next-btn">></button>  
      </div>
      <table class="${this.classNamePrefix}__btns-wrapper" id="${this.classNamePrefix}-btns"></table>
    `;
    this.createCalendar();
  }

  private createCalendar(): void {
    const yearsBtn = this.querySelector(`#${this.classNamePrefix}-show-years`) as HTMLButtonElement;
    const monthsBtn = this.querySelector(`#${this.classNamePrefix}-show-months`) as HTMLButtonElement;

    yearsBtn.onclick = (e) => {
      e.preventDefault();
      this.renderYears();
    };
    monthsBtn.onclick = (e) => {
      e.preventDefault();
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
    const prevBtn = this.querySelector(`#${this.classNamePrefix}-prev-btn`) as HTMLButtonElement;
    const nextBtn = this.querySelector(`#${this.classNamePrefix}-next-btn`) as HTMLButtonElement;
    const { month, year } = this.currentDate;
    datesWrapper.innerHTML = '';
    prevBtn.onclick = (e) => {
      e.preventDefault();
      if (+month === 0) {
        this.setYear((+year - 1).toString());
        this.setMonth(this.monthsNames[11]);
      } else {
        this.setMonth(this.monthsNames[+month - 1]);
      }
    };
    nextBtn.onclick = (e) => {
      e.preventDefault();
      if (+month === 11) {
        this.setYear((+year + 1).toString());
        this.setMonth(this.monthsNames[0]);
      } else {
        this.setMonth(this.monthsNames[+month + 1]);
      }
    };
    this.renderTable(datesWrapper, this.daysNames, this.getTableData(month, year));
    const changeEvent = new Event('change');
    this.dispatchEvent(changeEvent);
    this.setAttribute('month', this.currentDate.month);
    this.setAttribute('year', this.currentDate.year);
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
    const lastDateOfPrevMonth = this.getLastDateOfMonth((+month - 1), +year);
    const datesBefore = this.getDatesBefore(firstWeekDayOfMonth, lastDateOfPrevMonth);
    const datesThisMonth = this.getDatesThisMonth(lastDayOfMonth);
    const datesAfterCount = 42 - datesBefore.length - datesThisMonth.length;
    const datesAfter = this.getDatesAfter(datesAfterCount);
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
      arr.push(date);
      date -= 1;
    }
    return arr.reverse();
  }

  private getDatesAfter(count: number): number[] {
    const arr = [];
    let date = 1;
    for (let i = 1; i <= count; i += 1) {
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
      button.onclick = (e) => {
        e.preventDefault();
        callback(value);
      };
    }
    return button;
  }
}

customElements.define('app-calendar', AppCalendar);
