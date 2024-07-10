import React from 'react';
import { Skeleton } from '@mui/material';
import { DeviceDetailMainInformation } from './components/DeviceDetailMainInformation';
import { DeviceDetailGraph } from './components/DeviceDetailGraph';
import './deviceDetail.scss';

export const DeviceDetail = ({ device, showActions = false, loadingDevice, graphFilterProps }) => {
  if (!device || loadingDevice) return <DeviceDetailSkeleton />;

  return (
    <>
      <DeviceDetailMainInformation  
        showActions={showActions}
        device={device}
      />
      <DeviceDetailGraph 
        showActions={showActions}
        graphFilterProps={graphFilterProps}
      />
    </>
  );
};

const DeviceDetailSkeleton = () => (
  <div className="device-detail-skeleton">
    <div className="device-item-skeleton">
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="rectangular" width={'50%'} height={20} />
    </div>
    <div className="device-item-skeleton">
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="rectangular" width={'50%'} height={20} />
    </div>
    <div className="device-item-skeleton">
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="rectangular" width={'50%'} height={20} />
    </div>
    <div className="device-item-skeleton">
      <Skeleton variant="rectangular" width={'25%'} height={20} />
    </div>
    <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
  </div>
);
