import React, { useState } from 'react';
import { Button, Dialog } from '@mui/material';
import { LabeledInput } from '../Inputs/LabeledInput';
import { EmailInput } from '../Inputs/EmailInput';
import { PasswordInput } from '../Inputs/PasswordInput';
import { DropdownInput } from '../Inputs/DropdownInput';
import { useMutation } from '@apollo/client';
import { ADD_INTERNAL_USER } from '../../../data/graphQL/mutations/addInternalUser/addInternalUser';
import { LoadingButton } from '@mui/lab';
import { areCredentialsValid } from '../../../utils/validations/credentialsValidator';
import './invitedUsersFormDialog.scss';
import { useNavigate } from 'react-router-dom';

export const InvitedUsersFormDialog = ({
  showAddInvitedUsersDialog,
  closeInvitedUsersDialog,
  refetchUsers
}) => {
  const navigate = useNavigate();
  
  const [ inviteUserFormData, setInviteUserFormData ] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });

  const [ credentialValidations, setCredentialValidations ] = useState({
    isEmailValid: true,
    isPasswordValid: true,
  });

  const [ addUserCollaborator, { loading } ] = useMutation(ADD_INTERNAL_USER);

  const handleInviteUserFormChange = (name, value) => {
    setInviteUserFormData({
      ...inviteUserFormData,
      [name]: value,
    });
  };

  const handleInviteUserFormSubmit = async (event) => {
    event.preventDefault();
   
    const validation = areCredentialsValid({
      email: inviteUserFormData.email, 
      password: inviteUserFormData.password
    });
    setCredentialValidations(validation);

    if (!validation.isEmailValid || !validation.isPasswordValid) return;

    const rolId = inviteUserFormData.role === 'Colaborador' ? 3 : 4;

    await addUserCollaborator({
      variables: {
        password: inviteUserFormData.password,
        name: inviteUserFormData.name,
        lastName: inviteUserFormData.lastName,
        email: inviteUserFormData.email,
        rolId: rolId
      }
    });
    if (refetchUsers) refetchUsers();
    closeInvitedUsersDialog();
    navigate('/invited-users');
  };

  return(
    <Dialog
      open={showAddInvitedUsersDialog}
      onClose={closeInvitedUsersDialog}
      maxWidth="sm"
      fullWidth
    >
      <form className="header-dialog-body" onSubmit={handleInviteUserFormSubmit}>
        <div className="dialog-title">Nuevo usuario invitado</div>
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
          error={!credentialValidations.isEmailValid}
        />

        <PasswordInput
          onPasswordChange={handleInviteUserFormChange}
          label="Contraseña"
          color="grey"
          description="Debe ser una combinación de mínimo 6 caracteres, letras y números con al menos una mayúscula"
          error={!credentialValidations.isPasswordValid}
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
            onClick={closeInvitedUsersDialog}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="secondary"
            type="submit"
            className="dialog-button"
            disabled={!inviteUserFormData.name.length ||
               !inviteUserFormData.lastName.length || 
               !inviteUserFormData.email.length || 
               !inviteUserFormData.password.length ||
                !inviteUserFormData.role.length}
          >
            Agregar
          </LoadingButton>
        </div> 
      </form>
    </Dialog>
  );
};
