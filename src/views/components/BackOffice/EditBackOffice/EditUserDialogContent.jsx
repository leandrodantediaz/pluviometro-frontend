import React, { useState } from 'react';
import { Button, Dialog, FormControl, Select, MenuItem, InputLabel, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { isEmailValid } from '../../../../utils/validations/emailValidator';
import { splitFullName } from '../../../../utils/format/splitFullName';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_USER } from '../../../../data/graphQL/mutations/editUser/editUser';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';

const EditUserDialogContent = ({ openEditUserDialog, handleCloseEditUserDialog, selectedUser, setIsUpdated }) => {
  const { name, lastName } = splitFullName(selectedUser.fullName);
  const [ inviteUserFormData, setInviteUserFormData ] = useState({
    name,
    lastName,
    email: selectedUser.email,
  });

  const [ emailValid, setEmailValid ] = useState(true);
  const [ selectedPlan, setSelectedPlan ] = useState(selectedUser.planId);

  const [ editUser, { loading } ] = useMutation(EDIT_USER, {
    onCompleted: () => setIsUpdated(prev => !prev),
  });

  const { data: plansData } = useQuery(GET_ALL_PLANS, {
    variables: {
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    },
  });

  const handleInviteUserFormChange = (event) => {
    const { name, value } = event.target;
    setInviteUserFormData({
      ...inviteUserFormData,
      [name]: value,
    });
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleInviteUserFormSubmit = async (event) => {
    event.preventDefault();
    const validation = isEmailValid(inviteUserFormData.email);
    setEmailValid(validation);

    if (!validation) return;

    const rolId = selectedUser.rol?.id;

    await editUser({
      variables: {
        planId: selectedPlan,
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
  };

  return (
    <Dialog
      open={openEditUserDialog}
      onClose={handleCloseEditUserDialog}
      maxWidth="sm"
      fullWidth
    >
      <form className="header-dialog-body" onSubmit={handleInviteUserFormSubmit}>
        <div className="dialog-title">Editar usuario</div>
        <TextField
          margin="dense"
          id="user-name"
          label="Nombre"
          name="name"
          value={inviteUserFormData.name}
          onChange={handleInviteUserFormChange}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          id="user-last-name"
          label="Apellido"
          name="lastName"
          value={inviteUserFormData.lastName}
          onChange={handleInviteUserFormChange}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          id="user-email"
          label="Email"
          name="email"
          value={inviteUserFormData.email}
          onChange={handleInviteUserFormChange}
          fullWidth
          variant="outlined"
          error={!emailValid}
          helperText={!emailValid && 'Email no válido'}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-plan-label">Nombre del plan</InputLabel>
          <Select
            labelId="select-plan-label"
            id="select-plan"
            value={selectedPlan}
            onChange={handlePlanChange}
            label="Nombre del plan"
          >
            {plansData && plansData.allPlans && plansData.allPlans.items.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
              !inviteUserFormData.name ||
              !inviteUserFormData.lastName ||
              !inviteUserFormData.email ||
              !selectedPlan
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

export default EditUserDialogContent;
