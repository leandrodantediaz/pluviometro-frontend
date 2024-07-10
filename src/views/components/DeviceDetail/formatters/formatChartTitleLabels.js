import { spanishMonth } from '../../../../utils/dates/spanishMonth';
import { formatDateInWordsLabel, formatYearInWordsLabel } from './formatDateLabels';

export const formatMonthTitleLabel = () => {
  const monthName = spanishMonth(currentDate.getMonth());
  return `Precipitación mensual diaria de ${monthName} de ${currentDate.getFullYear()}`;
};

export const formatMonthWeekTitleLabel = () => {
  const monthName = spanishMonth(currentDate.getMonth());
  return `Precipitación mensual semanal de ${monthName} de ${currentDate.getFullYear()}`;
};
  
export const formatDayTitleLabel = () => `Precipitación diaria del ${formatDateInWordsLabel(currentDate)}`;

export const formatWeekTitleLabel = () => 'Precipitación semanal';

export const formatYearTitleLabel = () => `Precipitación anual natural del ${formatYearInWordsLabel(currentDate)}`;

export const formatAgriculturalYearTitleLabel = () => (
  `Precipitación anual agrícola del ${formatYearInWordsLabel(currentDate)}`
);

const currentDate = new Date();
