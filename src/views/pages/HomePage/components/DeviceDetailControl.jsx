
import React from 'react';
import { Button, Slide } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DeviceDetail } from '../../../components/DeviceDetail/DeviceDetail';
import { useGraphFilterState } from '../../../components/DeviceDetail/components/useGraphFilterState';
import '../homePage.scss';

export const DeviceDetailControl = ({ device, onClose }) => {
  const navigate = useNavigate();
  const graphFilterProps = useGraphFilterState(false, device);

  return(
    <Slide in direction="up">
      <div className="device-information-container">
        <DeviceDetail device={device} graphFilterProps={graphFilterProps} />
        <div className="dialog-buttons-container">
          <Button
            className="detail-button"
            variant="outlined"
            color="gray"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            className="detail-button"
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/device/${device.id}`)}
          >
            Ver detalle
          </Button>
        </div>
      </div>
    </Slide>
  ); 
};
