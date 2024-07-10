import React, { useCallback, useEffect } from 'react';
import { MapControlHeader } from './components/MapControlHeader';
import { DeviceDetailControl } from './components/DeviceDetailControl';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { DevicesMap } from './components/DevicesMap';
import { GET_DEVICES } from '../../../data/graphQL/queries/getDevices/getDevices';
import { allDevicesAdapter } from '../../../data/graphQL/queries/getDevices/adapters/allDevicesAdapter';
import { useMap } from '@vis.gl/react-google-maps';
import useCenterMap, { DEFAULT_CAMERA } from './hooks/useCenterMap';

export const HomePage = () => {
  const [ cameraProps, setCameraProps ] = useState(DEFAULT_CAMERA);
  const handleCameraChange = useCallback((ev) => setCameraProps(ev.detail), []);
  
  const { data, loading: loadingDevices } = useQuery(GET_DEVICES);
  const [ devices, setDevices ] = useState([]);

  useEffect(() => {
    const devices = allDevicesAdapter(data?.devicesByUser) || [];
    setDevices(devices);
  }, [ data ]);

  const [ deviceDetail, setDeviceDetail ] = useState({
    isOpen: false, 
    device: null
  });

  const handleDeviceDetailOpen = useCallback((device) => {
    setDeviceDetail({ isOpen: true, device });
    setCameraProps({
      center: device.position,
      zoom: 15,
    });
  }, []);

  const handleDeviceDetailClose = useCallback(() => {
    setDeviceDetail({ isOpen: false, device: null });
  }, []);

  const map = useMap();
  const { loadingMap, handleCenterMap } = useCenterMap(map, devices, loadingDevices);

  useEffect(() => {
    handleCenterMap();
  }, [ devices ]);

  return (
    <>
      <DevicesMap
        cameraProps={cameraProps}
        handleCameraChange={handleCameraChange}
        devices={devices}
        handleDeviceDetailOpen={handleDeviceDetailOpen}
        loadingMap={loadingMap}
      />
      <MapControlHeader 
        handleDeviceDetailOpen={handleDeviceDetailOpen}
        devices={devices}
        handleDevicesMapCenter={handleCenterMap}
      />
      {deviceDetail.isOpen &&
        <DeviceDetailControl onClose={handleDeviceDetailClose} device={deviceDetail.device} />
      }
    </>
  );
};
