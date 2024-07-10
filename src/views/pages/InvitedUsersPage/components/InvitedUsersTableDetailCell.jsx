import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_USER } from '../../../../data/graphQL/mutations/deleteUser/deleteUser';
import { IconButton, Button, Popover, Dialog } from '@mui/material';
import { DetailsIcon, EditIcon, TrashIcon } from '../../../../icons';
import { splitFullName } from '../../../../utils/format/splitFullName';
import { isEmailValid } from '../../../../utils/validations/emailValidator';
import { LabeledInput } from '../../../components/Inputs/LabeledInput';
import { EmailInput } from '../../../components/Inputs/EmailInput';
import { DropdownInput } from '../../../components/Inputs/DropdownInput';
import { LoadingButton } from '@mui/lab';
import { EDIT_USER } from '../../../../data/graphQL/mutations/editUser/editUser';

export const InvitedUsersTableDetailsCell = ({ 
  refetchUsers,
  handleChangeSelectedUser,
  selectedUser,
  currentCellUser,
  isCurrentUser
}) => {
  const [ anchorEl, setAnchorEl ] = useState(null);

  const handlePopoverOpen = (user, event) => {
    setAnchorEl(event.currentTarget);
    handleChangeSelectedUser(user);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    handleChangeSelectedUser(null);
  };

  const [ openDeleteUserConfirmation, setOpenDeleteUserConfirmation ] = useState(false);
  const [ openEditUserDialog, setOpenEditUserDialog ] = useState(false);

  const handleDeleteButtonClick = () => {
    setOpenDeleteUserConfirmation(true);
  };

  const handleCloseDeleteUserConfirmation = () => {
    setOpenDeleteUserConfirmation(false);
    handlePopoverClose();
  };

  const handleEditButtonClick = () => {
    setOpenEditUserDialog(true);
  };

  const handleCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
    handlePopoverClose();
  };

  return (
    <>
      <div>
        <IconButton
          onClick={(event) => handlePopoverOpen(currentCellUser, event)}
          size="small"
        >
          <DetailsIcon />
        </IconButton>
        <Popover
          open={Boolean(anchorEl && selectedUser.id === currentCellUser.id)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { className: 'detail-container' } }}
        >
          <Button
            onClick={handleEditButtonClick}
            color="black"
            className="user-detail-item"
            startIcon={<EditIcon strokeWidth={2} sx={{ fontSize: '16px !important' }} />}
          >
            Editar
          </Button>
          {!isCurrentUser &&
            <Button
              onClick={handleDeleteButtonClick}
              color="black"
              className="user-detail-item"
              startIcon={<TrashIcon sx={{ fontSize: '16px !important' }} />}
            >
              Eliminar
            </Button>
          }
        </Popover>
      </div>
      {openEditUserDialog &&
        <EditInvitedUserDialog 
          openEditUserDialog={openEditUserDialog}
          handleCloseEditUserDialog={handleCloseEditUserDialog}
          selectedUser={selectedUser}
          refetchUsers={refetchUsers}
        />
      }
      {openDeleteUserConfirmation &&
        <ConfirmDeleteInvitedUserDialog 
          openDeleteUserConfirmation={openDeleteUserConfirmation}
          handleCloseDeleteUserConfirmation={handleCloseDeleteUserConfirmation}
          selectedUser={selectedUser}
          refetchUsers={refetchUsers}
        />
      }
    </>
  );
};

const EditInvitedUserDialog = ({ 
  openEditUserDialog,
  handleCloseEditUserDialog, 
  selectedUser,
  refetchUsers
}) => {
  const { name, lastName } = splitFullName(selectedUser.fullName);
  const [ inviteUserFormData, setInviteUserFormData ] = useState({
    name,
    lastName,
    email: selectedUser.email,
    role: selectedUser.rol.displayName,
  });

  const [ emailValid, setEmailValid ] = useState(true);

  const [ editUser, { loading } ] = useMutation(EDIT_USER, {
    onCompleted: () => refetchUsers(),
  });

  const handleInviteUserFormChange = (name, value) => {
    setInviteUserFormData({
      ...inviteUserFormData,
      [name]: value,
    });
  };

  const handleInviteUserFormSubmit = async (event) => {
    event.preventDefault();
    const validation = isEmailValid(inviteUserFormData.email);
    setEmailValid(validation);

    if (!validation) return;

    const rolId = inviteUserFormData.role === 'Colaborador' ? 3 : 4;
    try {
      await editUser({
        variables: {
          planId: selectedUser.planId,
          id: selectedUser.id,
          email: inviteUserFormData.email,
          cuit: selectedUser.cuit,
          phone: selectedUser.phone,
          lastName: inviteUserFormData.lastName,
          name: inviteUserFormData.name,
          rolId: rolId
        }
      });
      handleCloseEditUserDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={openEditUserDialog}
      onClose={handleCloseEditUserDialog}
      maxWidth="sm"
      fullWidth
    >
      <form className="header-dialog-body" onSubmit={handleInviteUserFormSubmit}>
        <div className="dialog-title">Editar usuario invitado</div>
        <LabeledInput
          id="invited-user-name"
          label="Nombre"
          value={inviteUserFormData.name}
          onChange={handleInviteUserFormChange}
          name="name"
          color="grey"
          type="text"
        />

        <LabeledInput
          id="invited-user-last-name"
          label="Apellido"
          value={inviteUserFormData.lastName}
          onChange={handleInviteUserFormChange}
          name="lastName"
          color="grey"
          type="text"
        />

        <EmailInput
          onEmailChange={handleInviteUserFormChange}
          value={inviteUserFormData.email}
          label="Email"
          color="grey"
          error={!emailValid}
        />

        <DropdownInput
          label="Rol"
          value={inviteUserFormData.role}
          onRolChange={handleInviteUserFormChange}
          name="role"
          color="grey"
        />

        <div className="header-dialog-buttons-container">
          <Button
            variant="outlined"
            color="gray"
            className="dialog-button"
            onClick={handleCloseEditUserDialog}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant="contained"
            color="secondary"
            type="submit"
            className="dialog-button"
            disabled={
              !inviteUserFormData.name.length ||
              !inviteUserFormData.lastName.length || 
              !inviteUserFormData.email.length || 
              !inviteUserFormData.role.length
            }
            loading={loading}
          >
            Guardar
          </LoadingButton>
        </div> 
      </form>
    </Dialog>
  ); 
};

const ConfirmDeleteInvitedUserDialog = ({ 
  openDeleteUserConfirmation,
  handleCloseDeleteUserConfirmation, 
  selectedUser,
  refetchUsers
}) => {
  const [ deleteUser, { loading } ] = useMutation(DELETE_USER, {
    onCompleted: () => refetchUsers()
  });

  const handleDeleteUser = async () => {
    try {
      await deleteUser({ variables: { id: selectedUser.id } });
      handleCloseDeleteUserConfirmation();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={openDeleteUserConfirmation}
      onClose={handleCloseDeleteUserConfirmation}
      maxWidth="sm"
      fullWidth
    >
      <div className="header-dialog-body">
        <div className="dialog-title">Eliminar usuario</div>
        <div>¿Está seguro de que desea eliminar éste usuario?</div>
        <div className="header-dialog-buttons-container">
          <Button
            variant="outlined"
            color="gray"
            className="dialog-button"
            onClick={handleCloseDeleteUserConfirmation}
          >
            Cancelar
          </Button>
          <LoadingButton
            variant="contained"
            color="secondary"
            className="dialog-button"
            onClick={handleDeleteUser}
            loading={loading}
          >
            Confirmar
          </LoadingButton>
        </div> 
      </div>
    </Dialog>
  ); 
};
