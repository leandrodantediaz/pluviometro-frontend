import React, { useState } from 'react';
import { Avatar, Drawer, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ExpandIcon, PowerIcon } from '../../../../icons';
import UserService from '../../../../data/services/UserService';
import AuthService from '../../../../data/services/AuthService';
import { GraphQLProvider } from '../../../../data/graphQL/GraphQLProvider';
import { useApolloClient } from '@apollo/client';

export const HeaderMenuMobile = ({ controls }) => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { fullName: currentUserName } = UserService.getUser();
  const splittedName = currentUserName.split(' ');
  const currentUserInitials = `${splittedName[0][0]}${splittedName[1][0]}`;

  const [ openMenu, setOpenMenu ] = useState(false);

  const toggleMenu = (menuState) => () => {
    setOpenMenu(menuState);
  };

  const handleLogout = () => {
    AuthService.logout();
    GraphQLProvider.clearCache(client);
    navigate('/login');
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={openMenu}
        onClose={toggleMenu(false)}
        className="account-menu-drawer"
      >
        <div className="user-name-container-mobile">
          <Avatar
            sx={{
              bgcolor: '#F4D167',
              color: '#21272A',
              fontSize: '12px',
              fontWeight: 500,
              border: '1.5px solid #C4C4C4',
            }}
          >
            {currentUserInitials}
          </Avatar>
          {currentUserName}
        </div>

        {controls}

        <div onClick={handleLogout} className="account-menu-item-container ">
          <PowerIcon sx={{ fontSize: 18 }} />
          <div className="account-menu-item">Logout</div>
        </div>
      </Drawer>

      <IconButton
        onClick={toggleMenu(true)}
        size="small"
      >
        <ExpandIcon />
      </IconButton>
    </>
  );
};
