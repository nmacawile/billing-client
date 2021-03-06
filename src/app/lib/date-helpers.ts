interface DateRange {
  start_date: Date;
  end_date: Date;
}

const TABLE: { [key: string]: number[] } = {
  '': [0, 0, 0, 0, 0, 0, 0],
  'Mon-Sun': [1, 1, 1, 1, 1, 1, 1],
  'Mon-Sat': [0, 1, 1, 1, 1, 1, 1],
  'Mon-Fri': [0, 1, 1, 1, 1, 1, 0],
  'Sat-Sun': [1, 0, 0, 0, 0, 0, 1],
  Sunday: [1, 0, 0, 0, 0, 0, 0],
  Monday: [0, 1, 0, 0, 0, 0, 0],
  Tuesday: [0, 0, 1, 0, 0, 0, 0],
  Wednesday: [0, 0, 0, 1, 0, 0, 0],
  Thursday: [0, 0, 0, 0, 1, 0, 0],
  Friday: [0, 0, 0, 0, 0, 1, 0],
  Saturday: [0, 0, 0, 0, 0, 0, 1],
  'Mon-Thu': [0, 1, 1, 1, 1, 0, 0],
  MWF: [0, 1, 0, 1, 0, 1, 0],
  TTh: [0, 0, 1, 0, 1, 0, 0],
};

export class DateHelpers {
  static getPrevious(date: Date): DateRange {
    const lastMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
    const lastMonth = lastMonthLastDate.getMonth();
    const lastYear = lastMonthLastDate.getFullYear();

    return {
      start_date: new Date(lastYear, lastMonth, 1),
      end_date: new Date(lastYear, lastMonth + 1, 0),
    };
  }

  static getNext(date: Date): DateRange {
    const _date = date || new Date();
    const start_date = new Date(_date.getFullYear(), _date.getMonth() + 1, 1);
    const end_date = new Date(
      start_date.getFullYear(),
      start_date.getMonth() + 1,
      0,
    );
    return { start_date, end_date };
  }

  static daysBetween(
    startDate: Date,
    endDate: Date,
    days: string = 'Mon-Sun',
  ): number {
    if (!startDate || !endDate || startDate > endDate) return 0;
    const breakdown = this.breakdownDaysOfWeek(startDate, endDate);
    return breakdown.reduce((acc, daysCount, i) => {
      if (TABLE[days][i]) return acc + daysCount;
      return acc;
    }, 0);
  }

  static countDeductions(days: string, daysOff: Date[]) {
    const chart = TABLE[days];
    return daysOff
      .map((d) => d.getDay())
      .reduce(
        (count, weekday) => (chart[weekday] === 1 ? count + 1 : count),
        0,
      );
  }

  static format(date: Date): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const m = months[date.getMonth()];
    const d = (date.getDate() + '').padStart(2, '0');
    const y = date.getFullYear();

    return `${m} ${d}, ${y}`;
  }

  static format2(date: Date, uppercase = true): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const m = months[date.getMonth()];
    const d = date.getDate() + '';
    const text = `${m} ${d}`;
    return uppercase ? text.toUpperCase() : text;
  }

  static simpleFormat(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = (date.getDate() + '').padStart(2, '0');
    return yyyy + mm + dd;
  }

  private static breakdownDaysOfWeek(startDate: Date, endDate: Date) {
    const dTotal = 1 + Math.abs((+endDate - +startDate) / 86400000);
    const wStart = startDate.getDay();
    const wEnd = endDate.getDay();
    const count = Math.trunc(dTotal / 7);
    return Array(7)
      .fill(0)
      .map((_, wDay) => {
        if (!(dTotal % 7) || !this.addRemainder(wStart, wEnd, wDay))
          return count;
        return count + 1;
      });
  }

  private static addRemainder(wStart: number, wEnd: number, wDay: number) {
    return (
      (wStart <= wEnd && wDay >= wStart && wDay <= wEnd) ||
      (wStart > wEnd && (wDay >= wStart || wDay <= wEnd))
    );
  }
}
