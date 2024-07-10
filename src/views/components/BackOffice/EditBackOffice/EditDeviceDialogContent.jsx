import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, FormControl, Typography, TextField, InputLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { EDIT_DEVICE } from '../../../../data/graphQL/mutations/editDevices/editDevices';

const EditDeviceDialogContent = ({ selectedDevice, handleCloseEditDeviceDialog }) => {
  const [ editForm, setEditForm ] = useState({
    deviceName: '',
    displayName: '',
    password: '',
    serialNumber: '',
    ownerId: '',
  });

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(GET_ALL_USERS, {
    variables: {
      filterInput: { disabled: { eq: false }, rol: { name: { eq: 'Administrator' } } },
      skip: 0,
      take: 100,
    },
  });

  useEffect(() => {
    if (selectedDevice) {
      setEditForm({ 
        deviceName: selectedDevice.userName || '',
        displayName:selectedDevice.name || '',
        password: selectedDevice.password || '',
        serialNumber: selectedDevice.serialNumber || '',
        ownerId: selectedDevice.owner?.id || '',
      });
    }
  }, [ selectedDevice ]);

  const [ editDevice ] = useMutation(EDIT_DEVICE, {
    onCompleted: () => {
      handleCloseEditDeviceDialog(); 
      refetchUsers();
    },
  });

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => { return {
      ...prevForm,
      [name]: value,
    }; });
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    await editDevice({
      variables: {
        id: selectedDevice.id,
        deviceName: editForm.deviceName,
        displayName: editForm.displayName,
        password: editForm.password,
        serialNumber: editForm.serialNumber,
        ownerId: editForm.ownerId === 'null' ? null : parseInt(editForm.ownerId, 10),
      },
    });
  };

  const handleCancelEdit = () => {
    handleCloseEditDeviceDialog(); 
  };

  return (
    <form className="header-dialog-body" onSubmit={handleEditFormSubmit}>
      <div className="dialog-title">Editar dispositivo</div>

      {selectedDevice?.disabled && (
        <Typography color="error">
          Debe habilitar el dispositivo para poder editarlo.
        </Typography>
      )}

      <TextField
        fullWidth
        label="Etiqueta del dispositivo"
        variant="outlined"
        sx={{ mb: 2 }}
        name="displayName"
        value={editForm.displayName}
        onChange={handleEditFormChange}
        disabled={selectedDevice?.disabled}
      />

      <TextField
        fullWidth
        label="Device name"
        variant="outlined"
        sx={{ mb: 2 }}
        name="deviceName"  
        value={editForm.deviceName}
        onChange={handleEditFormChange}
        disabled={selectedDevice?.disabled}
      />

      <TextField
        fullWidth
        label="Contraseña"
        variant="outlined"
        sx={{ mb: 2 }}
        name="password"
        value={editForm.password}
        onChange={handleEditFormChange}
        type="password"
        disabled={selectedDevice?.disabled}
      />

      <TextField
        fullWidth
        label="Número de Serie"
        variant="outlined"
        sx={{ mb: 2 }}
        name="serialNumber"
        value={editForm.serialNumber}
        onChange={handleEditFormChange}
        disabled={selectedDevice?.disabled}
      />

      <FormControl fullWidth>
        <InputLabel id="select-user-label">Propietario</InputLabel>
        <Select
          labelId="select-user-label"
          fullWidth
          variant="outlined"
          label="Propietario"
          sx={{ mb: 2 }}
          value={editForm.ownerId}
          onChange={handleEditFormChange}
          name="ownerId"
          disabled={selectedDevice?.disabled}
          renderValue={(selected) => {
            if (selected === 'null') {
              return 'Sin administrador';
            }
            const selectedUser = usersData?.allUsers?.items.find((user) => user.id === selected);
            return selectedUser?.fullName || '';
          }}
        >
          <MenuItem value="null">Sin administrador</MenuItem>
          {usersLoading ? (
            <MenuItem value="" disabled>
              Cargando usuarios...
            </MenuItem>
          ) : usersError ? (
            <MenuItem value="" disabled>
              Error al cargar usuarios
            </MenuItem>
          ) : (
            usersData?.allUsers?.items.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.fullName}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <div className="header-dialog-buttons-container">
        <Button
          variant="outlined"
          color="gray"
          className="dialog-button"
          onClick={handleCancelEdit}
        >
          Cancelar
        </Button>
        <LoadingButton
          variant="contained"
          color="secondary"
          type="submit"
          className="dialog-button"
          disabled={
            !editForm.deviceName ||
            !editForm.displayName ||
            !editForm.password ||
            !editForm.serialNumber ||
            (!editForm.ownerId && editForm.ownerId !== null) ||
            selectedDevice?.disabled
          }
        >
          Guardar
        </LoadingButton>
      </div>
    </form>
  );
};

export default EditDeviceDialogContent;
