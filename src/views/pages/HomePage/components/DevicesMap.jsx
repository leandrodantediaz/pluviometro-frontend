import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { MarkerWithInfowindow } from './MarkerWithInfowindow';
import { Dialog, LinearProgress } from '@mui/material';

export const DevicesMap = ({ cameraProps, handleCameraChange, devices, handleDeviceDetailOpen, loadingMap }) => (
  <>
    <Dialog className="map-loader-container" open={loadingMap}>
      <div className="loader-text">
        Por favor, aguarde un instante
      </div>
      <LinearProgress />
    </Dialog>
    <Map
      mapId={'bf51a910020fa25a'}
      style={{ height: '100vh' }}
      gestureHandling="greedy"
      disableDefaultUI
      zoomControl
      mapTypeId="hybrid"
      onCameraChanged={handleCameraChange}
      {...cameraProps}
    >
      {devices.map((device) => (
        <MarkerWithInfowindow
          key={device.id}
          device={device}
          onDeviceDetailOpen={() => handleDeviceDetailOpen(device)}
        />
      ))}
    </Map>
  </>
);

