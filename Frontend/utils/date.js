import { format } from 'date-fns';

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
