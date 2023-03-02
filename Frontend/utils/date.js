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

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = monthsOfYear[date.getMonth()];
  const dayOfMonth = date.getDate();
  let suffix = 'th';
  const year = date.getFullYear();

  if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
    suffix = 'st';
  } else if (dayOfMonth === 2 || dayOfMonth === 22) {
    suffix = 'nd';
  } else if (dayOfMonth === 3 || dayOfMonth === 23) {
    suffix = 'rd';
  }

  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}${suffix}, ${year}`;
  return formattedDate;
}

export const getMonthDate = (dateString) => {
  const date = new Date(dateString);
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const month = monthsOfYear[date.getMonth()];
  const dayOfMonth = date.getDate();
  let suffix = 'th';
  const year = date.getFullYear();

  if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
    suffix = 'st';
  } else if (dayOfMonth === 2 || dayOfMonth === 22) {
    suffix = 'nd';
  } else if (dayOfMonth === 3 || dayOfMonth === 23) {
    suffix = 'rd';
  }

  const formattedDate = `${month} ${dayOfMonth}${suffix}, ${year}`;
  return formattedDate;
}
