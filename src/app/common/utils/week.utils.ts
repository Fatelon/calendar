export const START_OF_WEEK_DAY = 0;

export const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = date.getDay();
  const diff = (day >= START_OF_WEEK_DAY) ? day - START_OF_WEEK_DAY : 7 - (START_OF_WEEK_DAY - day);

  start.setDate(date.getDate() - diff);
  start.setHours(0, 0, 0, 0);

  return start;
};

export const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);

  end.setDate(start.getDate() + 6);
  return end;
};
