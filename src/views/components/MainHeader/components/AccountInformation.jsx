import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PowerIcon } from '../../../../icons';
import UserService from '../../../../data/services/UserService';
import AuthService from '../../../../data/services/AuthService';
import '../mainHeader.scss';
import { GraphQLProvider } from '../../../../data/graphQL/GraphQLProvider';
import { useApolloClient } from '@apollo/client';

export const AccountInformation = () => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const { fullName: currentUserName } = UserService.getUser();
  const splittedName = currentUserName.split(' ');
  const currentUserInitials = `${splittedName[0][0]}${splittedName[1][0]}`;

  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    GraphQLProvider.clearCache(client);
    navigate('/login');
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        style={{ marginTop: '25px' }}
      >
        <div className="user-name-container">
          {currentUserName}
        </div>
        <MenuItem onClick={handleLogout} style={{ padding: 16, marginBottom: 10 }}>
          <PowerIcon sx={{ fontSize: 18 }} />
          <div className="account-menu-item">Logout</div>
        </MenuItem>
      </Menu>

      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
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
      </IconButton>
    </>
  );
};
