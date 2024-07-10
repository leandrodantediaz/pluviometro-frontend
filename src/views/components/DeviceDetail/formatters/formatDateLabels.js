import { spanishMonth } from '../../../../utils/dates/spanishMonth';

export const formatDateLabel = date => date.toISOString().split('T')[0];
  
export const formatDateInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  return `${day} de ${spanishMonth(month)} de ${year}`;
};
  
export const formatDayAndMonthInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  return `${day} de ${spanishMonth(month)}`;
};

export const formatMonthInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const month = date.getUTCMonth();
  return `${spanishMonth(month)}`;
};

export const formatDayInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const day = date.getUTCDate();
  return `${day}`;
};

export const formatYearInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const year = date.getUTCFullYear();
  return `${year}`;
};
  
export const formatTimeLabel = ISODate => {
  const date = new Date(ISODate);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatWeekAndMonthInWordsLabel = ISODate => {
  const date = new Date(ISODate);
  const endDay = date.getUTCDate();
  const startDay = endDay - 6;
  const month = date.getUTCMonth();
  return `${startDay}-${endDay} de ${spanishMonth(month)}`;
};
