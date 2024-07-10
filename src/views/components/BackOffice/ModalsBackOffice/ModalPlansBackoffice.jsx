import React, { useState } from 'react';
import { Button, Modal, Box, Typography, TextField, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PLAN } from '../../../../data/graphQL/mutations/addPlanBackoffice/addPlanBackoffice';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import './modalBackoffice.scss';

export const ModalPlansBackoffice = ({ refetchPlansTable }) => {
  const theme = useTheme();
  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ formErrors, setFormErrors ] = useState({
    planName: false,
    maxAllowedUsers: false,
  });

  const [ formData, setFormData ] = useState({
    planName: '',
    maxAllowedUsers: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      planName: '',
      maxAllowedUsers: '',
    });
    setFormErrors({
      planName: false,
      maxAllowedUsers: false,
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

    if (name === 'maxAllowedUsers') {
      setFormErrors({
        ...formErrors,
        maxAllowedUsers: parseInt(value, 10) <= 0,
      });
    }
  };

  const { refetch: refetchPlans } = useQuery(GET_ALL_PLANS, {
    variables: {
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    },
  });

  const [ addPlan ] = useMutation(ADD_PLAN, {
    onCompleted: () => {
      handleClose();
      setIsSubmitting(false);
      refetchPlansTable();
      refetchPlans();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const validatePlanForm = () => {
    const { planName, maxAllowedUsers } = formData;

    if (!planName || !maxAllowedUsers) {
      setFormErrors({
        planName: planName === '',
        maxAllowedUsers: maxAllowedUsers === '',
      });
      return false;
    }

    if (parseInt(maxAllowedUsers, 10) <= 0) {
      setFormErrors({
        ...formErrors,
        maxAllowedUsers: true,
      });
      return false;
    }

    return true;
  };

  const handleAddPlan = async (event) => {
    event.preventDefault();
    if (!validatePlanForm()) return;

    try {
      setIsSubmitting(true);
      await addPlan({
        variables: {
          planInput: {
            name: formData.planName,
            maxAllowedUsers: parseInt(formData.maxAllowedUsers, 10),
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
        <div className="names">Planes</div>
        <Button
          className="button-modal"
          onClick={handleOpen}
          sx={{ color: '#2156BB', '&:hover': { backgroundColor: '#2C66D3' } }}
        >
          Agregar Planes
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
              Agregar Planes
            </Typography>
            <TextField
              fullWidth
              label="Nombre de Plan"
              variant="outlined"
              sx={{ mb: 2 }}
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              error={formErrors.planName}
            />
            <TextField
              fullWidth
              label="Cantidad Máxima de Usuarios Permitidos"
              variant="outlined"
              sx={{ mb: 2 }}
              type="number"
              name="maxAllowedUsers"
              value={formData.maxAllowedUsers}
              onChange={handleInputChange}
              error={formErrors.maxAllowedUsers}
            />
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
                onClick={handleAddPlan}
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
                Agregar Plan
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
};
