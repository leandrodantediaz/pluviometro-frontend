import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PRECIPITATION_DATA_RENDER } from '../../../../data/graphQL/queries/precipitationDataRender/precipitationDataRender';
import { processPrecipitationData } from '../utils/processDeviceData';
import { currentISODate } from '../../../../utils/dates/currentISODate';

export const usePrecipitationData = (filters) => {
  const { periodicity, monthlyGroupBy, calendarType, selectedDevices } = filters;
  const selectedDevicesId = selectedDevices.map(device => device.id);
  const [ chartData, setChartData ] = useState(null);

  const { data, loading, error, refetch } = useQuery(PRECIPITATION_DATA_RENDER, {
    variables: { 
      date: currentISODate(),
      devicesIds: selectedDevicesId, 
      periodicity: queryPeriodicity(filters)
    },
    skip: selectedDevicesId.length === 0,
  });

  useEffect(() => {
    if (data) {
      const processedData = processPrecipitationData({ 
        data: data.precipitationDataRender,
        periodicityQuery: queryPeriodicity(filters)
      });
      setChartData(processedData);
    }
  }, [ data, periodicity, monthlyGroupBy, calendarType ]);

  return { chartData, loadingPrecipitationData: loading, error, refetch };
};


const queryPeriodicity = ({ periodicity, monthlyGroupBy, calendarType }) => {
  switch (periodicity) {
  case 'mensual':
    if (monthlyGroupBy === 'Días') {
      return periodicityEnum.mensual;
    }
    if (monthlyGroupBy === 'Semanas') {
      return periodicityEnum.mensualSemanal;
    }
    break;
  case 'anual':
    if (calendarType === 'Agrícola') {
      return periodicityEnum.agriculturalYear;
    }
    if (calendarType === 'Natural')
      return periodicityEnum.anual;
    break;
  default:
    return periodicityEnum[periodicity];
  }
};

const periodicityEnum = {
  diaria: 'DAY',
  semanal: 'WEEK',
  mensual: 'MONTH',
  mensualSemanal: 'WEEK_MONTH',
  anual: 'YEAR',
  agriculturalYear: 'AGRICULTURAL_YEAR',
};
