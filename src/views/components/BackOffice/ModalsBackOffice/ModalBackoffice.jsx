import React from 'react';
import { ModalDevicesBackoffice } from './ModalDevicesBackoffice';
import { ModalPlansBackoffice } from './ModalPlansBackoffice';
import { ModalUserBackoffice } from './ModalUserBackoffice';

const ModalBackoffice = ({ section, refetchUsersTable, refetchDevicesTable, refetchPlansTable }) => {
  switch (section) {
  case 'Dispositivos':
    return <ModalDevicesBackoffice refetchDevicesTable={refetchDevicesTable} />;
  case 'Usuarios':
    return <ModalUserBackoffice refetchUsersTable={refetchUsersTable} />;
  case 'Plan':
    return <ModalPlansBackoffice refetchPlansTable={refetchPlansTable} />;
  default:
    return null;
  }
};

export default ModalBackoffice;
