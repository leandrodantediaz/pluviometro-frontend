import React, { useState } from 'react';
import { MainHeader } from '../../../views/components/MainHeader/MainHeader';
import { DevicesBackoffice } from '../../components/BackOffice/BackOfficeViews/DevicesBackoffice';
import { PlanBackOffice } from '../../components/BackOffice/BackOfficeViews/PlanBackOffice';
import { UserBackOffice } from '../../components/BackOffice/BackOfficeViews/UserBackOffice';
import '../../../scss/colors.scss';
import './backOffice.scss';
import ModalBackoffice from '../../components/BackOffice/ModalsBackOffice/ModalBackoffice';

const BackOffice = () => {
  const [ visibleSection, setVisibleSection ] = useState('Dispositivos');
  const [ selectedMenu, setSelectedMenu ] = useState('Dispositivos');

  const handleMenuClick = (section) => {
    setVisibleSection(section);
    setSelectedMenu(section);
  };

  const [ refetchUsersTable, setRefetchUsersTable ] = useState(() => () => {});
  const handleSetRefetchUsersTable = (refetchFn) => {
    setRefetchUsersTable(() => refetchFn);
  };

  const [ refetchDevicesTable, setRefetchDevicesTable ] = useState(() => () => {});
  const handleSetRefetchDevicesTable = (refetchFn) => {
    setRefetchDevicesTable(() => refetchFn);
  };

  const [ refetchUsersPlansTable, setRefetchUsersPlansTable ] = useState(() => () => {});
  const handleSetRefetchPlansTable = (refetchFn) => {
    setRefetchUsersPlansTable(() => refetchFn);
  };

  return (
    <div className="container">
      <div className="header">
        <MainHeader />
      </div>
      <div className="information">
        <div className="menu">
          <button
            className={`DeviceButton ${selectedMenu === 'Dispositivos' ? 'selected' : ''}`}
            onClick={() => {
              handleMenuClick('Dispositivos');
              setRefetchDevicesTable(() => handleSetRefetchDevicesTable);
            }}
          >
            Dispositivos
          </button>
          <button
            className={`UserButton ${selectedMenu === 'Usuarios' ? 'selected' : ''}`}
            onClick={() => {
              handleMenuClick('Usuarios');
              setRefetchUsersTable(() => handleSetRefetchUsersTable);
            }}
          >
            Usuarios
          </button>
          <button
            className={`PlanButton ${selectedMenu === 'Plan' ? 'selected' : ''}`}
            onClick={() => {
              handleMenuClick('Plan');
              setRefetchUsersPlansTable(() => handleSetRefetchPlansTable);
            }}
          >
            Plan
          </button>
        </div>
        <div className="Data">
          {visibleSection === 'Dispositivos' && <DevicesBackoffice setRefetch={handleSetRefetchDevicesTable} />}
          {visibleSection === 'Usuarios' && <UserBackOffice setRefetch={handleSetRefetchUsersTable} />}
          {visibleSection === 'Plan' && <PlanBackOffice setRefetch={handleSetRefetchPlansTable} />}

          <ModalBackoffice
            section={visibleSection}
            refetchUsersTable={refetchUsersTable}
            refetchDevicesTable={refetchDevicesTable}
            refetchPlansTable={refetchUsersPlansTable}
          />
        </div>
      </div>
    </div>
  );
};

export default BackOffice;
