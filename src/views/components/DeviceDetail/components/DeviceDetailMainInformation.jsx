import React from 'react';
import { EditIcon, NumeralIcon, PinIcon, PluviometroIcon } from '../../../../icons';
import { EditPluviometerNameDialog } from './EditPluviometerNameDialog';
import useEditDeviceName from '../hooks/useEditDeviceName';
import { Tooltip } from '@mui/material';

export const DeviceDetailMainInformation = ({ device, showActions }) => {
  const {
    isEditing,
    pluviometerName,
    temporalPluviometerName,
    loadingChangeDeviceName,
    handlePencilClick,
    handleNameChange,
    handleSaveEditPluviometerNameDialog,
    handleCloseEditPluviometerNameDialog
  } = useEditDeviceName(device);

  return(
    <>
      <DeviceItem
        icon={PluviometroIcon}
        title="Nombre de Dispositivo"
        text={pluviometerName}
        showActions={showActions}
        onEditClick={handlePencilClick}
        isEditable={true}
      />
    
      <DeviceItem
        icon={NumeralIcon}
        title="N° de Serie"
        text={device.serialNumber}
      />
    
      <div className={showActions ? 'device-coordinates-item-container' : 'device-coordinates-item-container-home'}>
        <DeviceItem
          icon={PinIcon}
          title="Coordenadas"
          text={`"lat": ${device.position.lat}, "long": ${device.position.lng}`}
        />
      
        <Tooltip
          arrow
          title="Última Comunicación"
          placement="right"
        >
          <div className="device-last-update">última actualización {device.lastCommunicationDate}</div>
        </Tooltip>
      </div>

      {showActions &&
        <EditPluviometerNameDialog
          isOpen={isEditing}
          loading={loadingChangeDeviceName}
          onClose={handleCloseEditPluviometerNameDialog}
          onSave={handleSaveEditPluviometerNameDialog}
          name={temporalPluviometerName}
          onNameChange={handleNameChange}
        />
      }
    </>
  ); 
};


const DeviceItem = ({ 
  icon: Icon, 
  title, 
  text, 
  showActions = false, 
  onEditClick = null, 
  isEditable = false 
}) => (
  <Tooltip arrow title={title} placement="right">
    <div className="device-item">
      <Icon />
      <div className="device-item-text">{text}</div>
      {showActions && isEditable && (
        <EditIcon
          style={{ cursor: 'pointer' }}
          fontSize="small"
          onClick={onEditClick}
          data-testid="edit-icon"
        />
      )}
    </div>
  </Tooltip>
);
