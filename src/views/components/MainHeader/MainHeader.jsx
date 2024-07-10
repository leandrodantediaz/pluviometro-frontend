import React, { useEffect, useState } from 'react';
import { Button, Dialog, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { LogoIcon } from '../../../icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountInformation } from './components/AccountInformation';
import { InvitedUsersFormDialog } from '../InvitedUsersFormDialog/InvitedUsersFormDialog';
import UserService from '../../../data/services/UserService';
import { GET_ALL_USERS } from '../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { useQuery } from '@apollo/client';
import { HeaderMenuMobile } from './components/HeaderMenuMobile';
import './mainHeader.scss';

export const MainHeader = ({ handleDevicesMapCenter }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const isInvitedUsersPage = pathname === '/invited-users';
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentUser = UserService.getUser();
  const isGuestUser = currentUser?.rolId === 4;
  const isAdminUser = currentUser?.rolId === 2;
  const isSuperAdminUser = currentUser?.rolId === 1;
  const currentUserOwnerId = isAdminUser ? currentUser?.id : currentUser?.userOwnerId;

  const { data: usersData } = useQuery(GET_ALL_USERS, {
    variables: {
      filterInput: {
        rol: { name: { in: [ 'Colaborator', 'Guest' ] } },
        disabled: { eq: false },
        userOwner: { id: { eq: currentUserOwnerId } } 
      },
      skip: 0,
      take: 25,
    },
    skip: isSuperAdminUser,
  });

  const [ internalUsersPresent, setInternalUsersPresent ] = useState(false);

  useEffect(() => {
    const internalUsersPresent = usersData?.allUsers?.totalCount > 0;
    setInternalUsersPresent(internalUsersPresent);
  }, [ usersData ]);


  const [ showInviteUsersDialog, setShowInviteUsersDialog ] = useState(false);
  const [ showAddInvitedUsersDialog, setShowAddInvitedUsersDialog ] = useState(false);

  const handleInvitedUsersClick = () => {
    if (internalUsersPresent) {
      navigate('/invited-users');
    } else {
      setShowInviteUsersDialog(true);
    }
  };

  return (
    <div className="main-header-container">
      <LogoIcon />
      {isMobile ?
        <HeaderMenuMobile
          controls={
            <div className="controls-container-mobile">
              {!isGuestUser && !isSuperAdminUser &&
                <Button
                  variant={isInvitedUsersPage ? 'contained' : 'outlined'}
                  className="control-button"
                  disabled={isInvitedUsersPage}
                  onClick={handleInvitedUsersClick}
                >
                  Usuarios Invitados
                </Button>
              }
            </div>
          }
        /> :
        <div className="controls-container">
          {!isSuperAdminUser &&
            <Button
              variant={isHomePage ? 'contained' : 'outlined'}
              className="control-button"
              onClick={isHomePage ? handleDevicesMapCenter : () => navigate('/')}
            >
              Mapa de dispositivos
            </Button>
          }
          {!isGuestUser && !isSuperAdminUser &&
            <Button
              variant={isInvitedUsersPage ? 'contained' : 'outlined'}
              className="control-button"
              onClick={handleInvitedUsersClick}
            >
              Usuarios Invitados
            </Button>
          }
          <AccountInformation />
        </div>
      }

      {showInviteUsersDialog &&
        <InvitedUsersDialog
          showInviteUsersDialog={showInviteUsersDialog}
          handleDialogClose={() => setShowInviteUsersDialog(false)}
          handleAddUser={() => { setShowInviteUsersDialog(false); setShowAddInvitedUsersDialog(true); }}
        />
      }
      {showAddInvitedUsersDialog &&
        <InvitedUsersFormDialog
          showAddInvitedUsersDialog={showAddInvitedUsersDialog}
          closeInvitedUsersDialog={() => setShowAddInvitedUsersDialog(false)}
        />
      }
    </div>
  );
};


const InvitedUsersDialog = ({ showInviteUsersDialog, handleDialogClose, handleAddUser }) => (
  <Dialog
    open={showInviteUsersDialog}
    onClose={handleDialogClose}
    maxWidth="sm"
    fullWidth
  >
    <div className="header-dialog-body">
      <div className="dialog-title">Usuarios invitados</div>
      <div>Aún no se agregaron usuarios.</div>
      <div className="header-dialog-buttons-container">
        <Button
          variant="outlined"
          color="gray"
          className="dialog-button"
          onClick={handleDialogClose}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="dialog-button"
          onClick={handleAddUser}
        >
          Agregar
        </Button>
      </div> 
    </div>
  </Dialog>
);
