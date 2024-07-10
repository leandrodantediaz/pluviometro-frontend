import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Select, MenuItem, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_USER } from '../../../../data/graphQL/mutations/addUserBackoffice/addUserBackoffice';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import { isEmailValid } from '../../../../utils/validations/emailValidator';
import '../backOfficeComponents.scss';

export const ModalUserBackoffice = ({ refetchUsersTable }) => {
  const theme = useTheme();
  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ emailError, setEmailError ] = useState(false);
  const [ formErrors, setFormErrors ] = useState({
    firstName: false,
    lastName: false,
    cuit: false,
    phone: false,
    email: false,
    plan: false,
  });

  const [ formData, setFormData ] = useState({
    firstName: '',
    lastName: '',
    cuit: '',
    phone: '',
    email: '',
    plan: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      cuit: '',
      phone: '',
      email: '',
      plan: '',
    });
    setEmailError(false);
    setFormErrors({
      firstName: false,
      lastName: false,
      cuit: false,
      phone: false,
      email: false,
      plan: false,
    });
    refetchPlans();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      setEmailError(value !== '' && !isEmailValid(value));
    }

    setFormErrors({
      ...formErrors,
      [name]: value === '',
    });
  };

  const { data: plansData, loading: plansLoading, error: plansError, refetch: refetchPlans } = useQuery(GET_ALL_PLANS, {
    variables: {
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    },
  });

  useEffect(() => {
    if (open) {
      refetchPlans();
    }
  }, [ open, refetchPlans ]);

  const [ addUser ] = useMutation(ADD_USER, {
    onCompleted: () => {
      handleClose();
      setIsSubmitting(false);
      refetchUsersTable();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const validateUserForm = () => {
    const { firstName, lastName, cuit, phone, email, plan } = formData;

    const anyEmptyField = Object.values(formData).some((value) => value === '');
    if (anyEmptyField) {
      setFormErrors({
        firstName: firstName === '',
        lastName: lastName === '',
        cuit: cuit === '',
        phone: phone === '',
        email: email === '',
        plan: plan === '',
      });
      return false;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return false;
    }

    return true;
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    if (!validateUserForm()) return;

    try {
      setIsSubmitting(true);
      await addUser({
        variables: {
          input: {
            fullName: `${formData.firstName} ${formData.lastName}`,
            cuit: formData.cuit,
            phone: formData.phone,
            email: formData.email,
            planId: parseInt(formData.plan, 10),
          },
        },
      });
      refetchUsersTable();
    } catch (error) {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-button">
      <div className="modal-head">
        <div className="names">Usuarios</div>
        <Button
          className="button-modal"
          onClick={handleOpen}
          sx={{ color: '#2156BB', '&:hover': { backgroundColor: '#2C66D3' } }}
        >
          Agregar Usuarios
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
              Agregar Usuarios
            </Typography>

            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
              sx={{ mb: 2 }}
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={formErrors.firstName}
            />
            <TextField
              fullWidth
              label="Apellido"
              variant="outlined"
              sx={{ mb: 2 }}
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={formErrors.lastName}
            />
            <TextField
              fullWidth
              label="CUIT"
              variant="outlined"
              sx={{ mb: 2 }}
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              error={formErrors.cuit}
            />
            <TextField
              fullWidth
              label="Teléfono"
              variant="outlined"
              sx={{ mb: 2 }}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              sx={{ mb: 2 }}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={emailError || formErrors.email}
            />
            <Select
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              value={formData.plan}
              onChange={handleInputChange}
              name="plan"
              displayEmpty
              error={formErrors.plan}
              inputProps={{ 'aria-label': 'plan' }}
            >
              <MenuItem value="" disabled>
                Seleccionar Plan
              </MenuItem>
              {plansLoading ? (
                <MenuItem value="" disabled>
                  Cargando planes...
                </MenuItem>
              ) : plansError ? (
                <MenuItem value="" disabled>
                  Error al cargar planes
                </MenuItem>
              ) : (
                plansData.allPlans.items.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
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
                onClick={handleAddUser}
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
                Agregar Usuario
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
