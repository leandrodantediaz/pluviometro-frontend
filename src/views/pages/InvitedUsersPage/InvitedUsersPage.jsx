import React, { useState } from 'react';
import { Button } from '@mui/material';
import { MainHeader } from '../../components/MainHeader/MainHeader';
import { AddIcon } from '../../../icons';
import { InvitedUsersTable } from './components/InvitedUsersTable';
import { InvitedUsersFormDialog } from '../../components/InvitedUsersFormDialog/InvitedUsersFormDialog';
import './invitedUsersPage.scss';

export const InvitedUsersPage = () => {
  const [ showAddInvitedUsersDialog, setShowAddInvitedUsersDialog ] = useState(false);

  const [ refetchUsers, setRefetchUsers ] = useState(() => () => {});

  const handleSetRefetch = (refetchFn) => {
    setRefetchUsers(() => refetchFn);
  };
  
  return(
    <div>
      <div className="page-container"> 
        <MainHeader />
        <div className="users-container">
          <div className="header-container">
            <div className="header-title">Usuarios invitados</div>
            <Button 
              variant="contained"
              color="secondary"
              className="add-users-button"
              startIcon={<AddIcon sx={{ fontSize: '14px !important' }} />}
              onClick={() => setShowAddInvitedUsersDialog(true)}
            >
              Agregar usuario
            </Button>
          </div>
          <InvitedUsersTable setRefetch={handleSetRefetch} />
        </div>
      </div>
      {showAddInvitedUsersDialog && (
        <InvitedUsersFormDialog
          showAddInvitedUsersDialog={showAddInvitedUsersDialog}
          closeInvitedUsersDialog={() => setShowAddInvitedUsersDialog(false)}
          refetchUsers={refetchUsers}
        />
      )}
    </div>
  ); 
};
