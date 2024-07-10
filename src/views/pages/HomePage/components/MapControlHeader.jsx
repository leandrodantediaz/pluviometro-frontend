import React from 'react';
import { DevicesList } from './DevicesList';
import { MainHeader } from '../../../components/MainHeader/MainHeader';
import '../homePage.scss';

export const MapControlHeader = ({ devices, handleDeviceDetailOpen, handleDevicesMapCenter }) => (
  <div className="map-control-container">
    <MainHeader handleDevicesMapCenter={handleDevicesMapCenter} />
    <DevicesList devices={devices} handleDeviceDetailOpen={handleDeviceDetailOpen} />
  </div>
);
