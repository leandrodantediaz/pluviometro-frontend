import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Select, MenuItem, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_DEVICE } from '../../../../data/graphQL/mutations/addDevicesBackoffice/addDevicesBackoffice';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import './modalBackoffice.scss';

export const ModalDevicesBackoffice = ({ refetchDevicesTable }) => {
  const theme = useTheme();
  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ formErrors, setFormErrors ] = useState({
    name: false,
    userName: false,
    serialNumber: false,
    password: false,
    selectedUserId: false,
  });

  const [ formData, setFormData ] = useState({
    name: '',
    userName: '',
    serialNumber: '',
    password: '',
    selectedUserId: '',
  });

  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(GET_ALL_USERS, {
    variables: {
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    },
  });

  useEffect(() => {
    if (open) {
      refetchUsers();
    }
  }, [ open, refetchUsers ]);

  const [ addDevice ] = useMutation(ADD_DEVICE, {
    onCompleted: () => {
      handleClose();
      setIsSubmitting(false);
      refetchDevicesTable();
      refetchUsers();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      userName: '',
      serialNumber: '',
      password: '',
      selectedUserId: '',
    });
    setFormErrors({
      name: false,
      userName: false,
      serialNumber: false,
      password: false,
      selectedUserId: false,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: value === '',
    });
  };

  const validateDeviceForm = () => {
    const { name, userName, serialNumber, password } = formData;
    if (!name || !userName || !serialNumber || !password) {
      setFormErrors({
        name: !name,
        userName: !userName,
        serialNumber: !serialNumber,
        password: !password,
        selectedUserId: !formData.selectedUserId,
      });
      return false;
    }
    return true;
  };

  const handleAddDevice = async (event) => {
    event.preventDefault();
    if (!validateDeviceForm()) return;

    try {
      setIsSubmitting(true);
      await addDevice({
        variables: {
          deviceInput: {
            deviceName: formData.name,
            displayName: formData.userName,
            password: formData.password,
            serialNumber: formData.serialNumber,
            userId: formData.selectedUserId || null,
          },
        },
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-button">
      <div className="modal-head">
        <div className="names">Dispositivos</div>
        <Button
          className="button-modal"
          onClick={handleOpen}
          sx={{ color: '#2156BB', '&:hover': { backgroundColor: '#2C66D3' } }}
        >
          Agregar Dispositivos
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="custom-modal">
          <Box
            sx={{
              width: 400,
              bgcolor: 'white',
              p: 3,
              borderRadius: '17px',
              [theme.breakpoints.down('sm')]: {
                width: '80%',
              },
            }}
          >
            <Typography
              style={{ padding: '10px', fontWeight: 'bold' }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Agregar Dispositivos
            </Typography>

            <TextField
              fullWidth
              label="Número de Serie"
              variant="outlined"
              sx={{ mb: 2 }}
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleInputChange}
              error={formErrors.serialNumber}
            />
            <TextField
              fullWidth
              label="Etiqueta del dispositivo"
              variant="outlined"
              sx={{ mb: 2 }}
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              error={formErrors.userName}
            />
            <TextField
              fullWidth
              label="Device name"
              variant="outlined"
              sx={{ mb: 2 }}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
            />
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              sx={{ mb: 2 }}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
            />
            <Select
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              value={formData.selectedUserId}
              onChange={handleInputChange}
              name="selectedUserId"
              displayEmpty
              error={formErrors.selectedUserId}
            >
              <MenuItem value="">
                Sin Administrador
              </MenuItem>
              {usersLoading ? (
                <MenuItem value="" disabled>
                  Cargando usuarios...
                </MenuItem>
              ) : usersError ? (
                <MenuItem value="" disabled>
                  Error al cargar usuarios
                </MenuItem>
              ) : (
                usersData.allUsers.items
                  .map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName}
                    </MenuItem>
                  ))
              )}
            </Select>
            <Box className="box-input" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="gray"
                className="dialog-button"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddDevice}
                sx={{
                  marginLeft: '20px',
                  variant: 'outlined',
                  color: isSubmitting ? 'grey' : 'white',
                  backgroundColor: '#2156BB',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: isSubmitting ? 'grey' : '#2C66D3',
                  },
                }}
                disabled={isSubmitting}
              >
                Agregar Dispositivo
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
