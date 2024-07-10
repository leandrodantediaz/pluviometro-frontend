import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, FilterIcon } from '../../../icons';
import { DeviceDetail } from '../../components/DeviceDetail/DeviceDetail';
import { useQuery } from '@apollo/client';
import { GET_DEVICE_BY_ID } from '../../../data/graphQL/queries/getDeviceById/getDeviceById';
import { deviceAdapter } from '../../../data/graphQL/queries/getDeviceById/adapters/deviceAdapter';
import { MainHeader } from '../../components/MainHeader/MainHeader';
import { Button } from '@mui/material';
import { useGraphFilterState } from '../../components/DeviceDetail/components/useGraphFilterState';
import './deviceDetailPage.scss';

export const DeviceDetailPage = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [ device, setDevice ] = useState();

  const { data, loading } = useQuery(GET_DEVICE_BY_ID, {
    variables: {
      deviceId: Number(deviceId) 
    }}
  );

  useEffect(() => {
    const device = deviceAdapter(data?.deviceById) || undefined;
    setDevice(device);
  }, [ data ]);

  const graphFilterProps = useGraphFilterState(true, device);

  return (
    <div className="device-detail-container">
      <MainHeader />
      <div className="device-detail">
        <div className="device-detail-filter-container">
          <div className="device-detail-header">
            <ArrowLeftIcon style={{ cursor: 'pointer' }} onClick={() => navigate('/')} data-testid="arrow-left-icon" />
            <div className="device-detail-title">Detalle del pluviometro</div>
          </div>
          <Button
            variant="contained"
            color="lightGray"
            endIcon={<FilterIcon sx={{ fontSize: '16px !important' }} />}
            onClick={graphFilterProps.openFilterDialog}
            className="filter-button"
          >
            <span style={{ marginRight: '-6px' }}>Filtrar</span>
          </Button>
        </div>
        <DeviceDetail
          showActions
          device={device}
          loadingDevice={loading}
          graphFilterProps={graphFilterProps}
        />
      </div>
    </div>
  );
};
