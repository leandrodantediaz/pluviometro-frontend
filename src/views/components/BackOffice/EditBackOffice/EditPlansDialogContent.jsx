import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const EditPlansDialogContent = ({ open, handleClose, handleSubmit, formData, handleFormChange, loading }) => (
  <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>Editar plan</DialogTitle>
    <DialogContent>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="dense"
          id="edit-plan-name"
          name="name"
          label="Nombre"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleFormChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          id="edit-plan-max-users"
          name="maxAllowedUsers"
          label="Máximo de usuarios invitados"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.maxAllowedUsers}
          onChange={handleFormChange}
          sx={{ mb: 2 }}
        />
        <DialogActions>
          <Button variant="outlined" color="gray" onClick={handleClose}>
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            color="secondary"
            variant="contained"
            loading={loading}
          >
            Guardar
          </LoadingButton>
        </DialogActions>
      </form>
    </DialogContent>
  </Dialog>
);

export default EditPlansDialogContent;
