import { formatDayAndMonthInWordsLabel, formatDateLabel, formatTimeLabel, formatDayInWordsLabel, formatMonthInWordsLabel, formatWeekAndMonthInWordsLabel } from '../formatters/formatDateLabels';
import { formatAgriculturalYearTitleLabel, formatDayTitleLabel, formatMonthTitleLabel, formatMonthWeekTitleLabel, formatWeekTitleLabel, formatYearTitleLabel } from '../formatters/formatChartTitleLabels';

export const processPrecipitationData = ({ data, periodicityQuery }) => {
  const { dataByDevice, deviceNameById } = processDeviceData(data);

  sortDataByDate(dataByDevice);

  const { 
    labelFormatter,
    titleFormatter,
    labelFormatterToCompare
  } = periodProcessor(periodicityQuery);

  const datasets = Object.keys(dataByDevice).map(deviceId => {
    const deviceData = dataByDevice[deviceId];
    return processDatasetForDevice(deviceData, deviceId, labelFormatter, deviceNameById[deviceId]);
  });

  const labels = collectUniqueDates(dataByDevice, labelFormatterToCompare || labelFormatter);
  const formattedLabels = labelFormatterToCompare ? labels.map(labelFormatter) : labels;

  return {
    labels: formattedLabels,
    datasets,
    title: titleFormatter(),
  };
};


const processDeviceData = data => data.reduce((processed, { date, deviceId, deviceName, precipitation }) => {
  if (!processed.dataByDevice[deviceId]) {
    processed.dataByDevice[deviceId] = [];
  }
  processed.dataByDevice[deviceId].push({ date: new Date(date), precipitation });
  processed.deviceNameById[deviceId] = deviceName;
  return processed;
}, { dataByDevice: {}, deviceNameById: {} });


const sortDataByDate = dataByDevice => {
  Object.values(dataByDevice).forEach(deviceData => {
    deviceData.sort((a, b) => a.date - b.date);
  });
};


const periodProcessor = (periodicityQuery) => PERIODICITY_PROCESSORS[periodicityQuery];

const PERIODICITY_PROCESSORS = {
  DAY: {
    labelFormatter: formatTimeLabel,
    titleFormatter: formatDayTitleLabel
  },
  MONTH: { 
    labelFormatter: formatDayInWordsLabel, 
    titleFormatter: formatMonthTitleLabel, 
    labelFormatterToCompare: formatDateLabel
  },
  WEEK: {
    labelFormatter: formatDayAndMonthInWordsLabel, 
    labelFormatterToCompare: formatDateLabel,
    titleFormatter: formatWeekTitleLabel, 
  },
  YEAR: { 
    labelFormatter: formatMonthInWordsLabel, 
    labelFormatterToCompare: formatDateLabel,
    titleFormatter: formatYearTitleLabel
  },
  AGRICULTURAL_YEAR: {
    labelFormatter: formatMonthInWordsLabel,
    labelFormatterToCompare: formatDateLabel,
    titleFormatter: formatAgriculturalYearTitleLabel
  },
  WEEK_MONTH: {
    labelFormatter: formatWeekAndMonthInWordsLabel,
    labelFormatterToCompare: formatDateLabel,
    titleFormatter: formatMonthWeekTitleLabel
  }
};


const processDatasetForDevice = (deviceData, deviceId, labelFormatter, label) => {
  const precipitations = deviceData.map(entry => { 
    return {
      x: labelFormatter(entry.date),
      y: entry.precipitation,
    };
  });

  return {
    label,
    data: precipitations,
    borderColor: `hsl(${deviceId * 120}, 70%, 50%)`,
    backgroundColor: `hsla(${deviceId * 120}, 70%, 50%, 0.5)`,
  };
};


const collectUniqueDates = (dataByDevice, labelFormatter) => {
  const labels = [];
  Object.values(dataByDevice).forEach(deviceData => {
    const dates = deviceData.map(entry => labelFormatter(entry.date));
    labels.push(...dates);
  });
  return Array.from(new Set(labels)).sort();
};
