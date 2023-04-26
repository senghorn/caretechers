import {
  addWeeks,
  addYears,
  differenceInCalendarYears,
  format,
  getDate,
  getDay,
  getMonth,
  isSameDay,
  max,
  differenceInDays,
  differenceInMonths,
  addMonths,
} from 'date-fns';

export const REPEAT_CODES = {
  DAY: 'Daily',
  WEEK: 'Weekly',
  MONTH: 'Monthly',
  ANNUAL: 'Annually',
  NEVER: 'Does not repeat',
};

export const getLabel = (recurringType, dateToUse) => {
  switch (recurringType) {
    case REPEAT_CODES.DAY:
      return 'Daily';
    case REPEAT_CODES.WEEK:
      return `Weekly on ${format(dateToUse, 'EEEE')}`;
    case REPEAT_CODES.MONTH:
      return `Monthly on the ${format(dateToUse, 'do')}`;
    case REPEAT_CODES.ANNUAL:
      return `Annually on ${format(dateToUse, 'MMMM do')}`;
    default:
      return REPEAT_CODES.NEVER;
  }
};

export const getRepeatBehaviorObject = (recurringType, dateToUse, id) => {
  switch (recurringType) {
    case REPEAT_CODES.DAY:
      return {
        separation_count: 0,
        day_of_week: null,
        week_of_month: null,
        day_of_month: null,
        month_of_year: null,
        recurring_type: REPEAT_CODES.DAY,
        task_id: id,
      };
    case REPEAT_CODES.WEEK:
      return {
        separation_count: 0,
        day_of_week: getDay(dateToUse) + 1,
        week_of_month: null,
        day_of_month: -1,
        month_of_year: null,
        recurring_type: REPEAT_CODES.WEEK,
        task_id: id,
      };
    case REPEAT_CODES.MONTH:
      return {
        separation_count: 0,
        day_of_week: -1,
        week_of_month: null,
        day_of_month: getDate(dateToUse),
        month_of_year: null,
        recurring_type: REPEAT_CODES.MONTH,
        task_id: id,
      };
    case REPEAT_CODES.ANNUAL:
      return {
        separation_count: 0,
        day_of_week: -1,
        week_of_month: null,
        day_of_month: getDate(dateToUse),
        month_of_year: getMonth(dateToUse) + 1,
        recurring_type: REPEAT_CODES.ANNUAL,
        task_id: id,
      };
    default:
      return null;
  }
};

export const translateRepeatBehaviorToString = (repeatBehavior, dateToUse) => {
  return getLabel(repeatBehavior.recurring_type, dateToUse);
};

export const getNextDateFromRepeatBehavior = (recurringType, startDate) => {
  const today = new Date();
  switch (recurringType) {
    case REPEAT_CODES.DAY:
      return max([today, startDate]);
    case REPEAT_CODES.WEEK:
      const diffInDays = differenceInDays(today, startDate);
      let diffInWeeks = Math.ceil(diffInDays / 7);
      if (diffInWeeks === 0 && today > startDate && !isSameDay(today, startDate)) {
        diffInWeeks = 1;
      }
      return max([addWeeks(startDate, diffInWeeks), startDate]);
    case REPEAT_CODES.MONTH:
      let diffInMonths = differenceInMonths(today, startDate);
      if (diffInMonths === 0 && today > startDate && !isSameDay(today, startDate)) {
        diffInMonths = 1;
      }
      return max([addMonths(startDate, diffInMonths), startDate]);
    case REPEAT_CODES.ANNUAL:
      let diffInYears = differenceInCalendarYears(today, startDate);
      if (diffInYears === 0 && today > startDate && !isSameDay(today, startDate)) {
        diffInYears = 1;
      }
      return max([addYears(startDate, diffInYears), startDate]);
    default:
      return startDate;
  }
};
