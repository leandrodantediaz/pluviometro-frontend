import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEVICES } from '../../../../data/graphQL/queries/getDevices/getDevices';
import { allDevicesAdapter } from '../../../../data/graphQL/queries/getDevices/adapters/allDevicesAdapter';

export const useGraphFilterState = (showActions, device) => {
  if (!showActions) return (
    {
      filters: {
        periodicity: 'diaria',
        selectedDevices: [ device ],
      }
    }
  );

  const defaultFilters = {
    devices: [],
    selectedDevices: device ? [ device ] : [],
    calendarType: 'Agrícola',
    periodicity: 'diaria',
    monthlyGroupBy: 'Días',
  };
  
  const [ temporalFilters, setTemporalFilters ] = useState(defaultFilters);
  const [ filters, setFilters ] = useState(defaultFilters);
  const [ filterDialogOpen, setFilterDialogOpen ] = useState(false);

  const { data: devicesData } = useQuery(GET_DEVICES);
  
  useEffect(() => {
    const devices = allDevicesAdapter(devicesData?.devicesByUser) || [];
    const selectedDevices = device ? [ device ] : [];

    setFilters(prevFilters => {
      return {
        ...prevFilters,
        devices,
        selectedDevices,
      };
    });
    setTemporalFilters(prevFilters => {
      return {
        ...prevFilters,
        devices,
        selectedDevices,
      };
    });
  }, [ devicesData, device ]);

  const handleFilterChange = (name, value) => {
    setTemporalFilters(prevFilters => { 
      return {
        ...prevFilters,
        [name]: value,
      };
    });
  };

  const handleSaveFilters = () => {
    setFilters(temporalFilters);
  };

  const handleResetFilters = () => {
    setTemporalFilters(filters);
  };

  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  return {
    filters,
    temporalFilters,
    filterDialogOpen, 
    handleFilterChange,
    handleSaveFilters,
    handleResetFilters,
    openFilterDialog,
    closeFilterDialog 
  };
};
