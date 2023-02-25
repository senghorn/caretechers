import { format, isToday, isTomorrow } from 'date-fns';

export const getDateFromDateString = (dateString) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(5, 7);
  const day = dateString.substring(8, 10);
  return new Date(year, Number(month) - 1, day);
};

export const getDateString = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const getCurrentDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getHumanReadableDate = (date, noTodayOrTomorrow) => {
  if (noTodayOrTomorrow) return format(date, 'MMMM do, y');
  return (isTomorrow(date) && 'tomorrow') || (isToday(date) && 'today') || format(date, 'MMMM do, y');
};
