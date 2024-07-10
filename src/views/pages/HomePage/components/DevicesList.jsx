import React from 'react';
import { Button } from '@mui/material';
import '../homePage.scss';

export const DevicesList = ({ devices, handleDeviceDetailOpen }) => (
  <div className="devices-container">
    {devices?.map((device) => (
      <Button 
        key={device.id}
        variant="contained"
        color="light"
        className="device-button"
        onClick={() => handleDeviceDetailOpen(device)}
      >
        {device.name}
      </Button>
    ))}
  </div>
);
