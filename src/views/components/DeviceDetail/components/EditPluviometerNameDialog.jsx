import React from 'react';
import { Button, Dialog } from '@mui/material';
import { BaseInput } from '../../Inputs/BaseInput';
import { LoadingButton } from '@mui/lab';

export const EditPluviometerNameDialog = ({ isOpen, onClose, onSave, name, onNameChange, loading }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
  >
    <div className="dialog-body">
      <div className="dialog-title">Modificar nombre</div>
      <BaseInput
        type="text"
        value={name}
        onChange={onNameChange}
        error={name.length === 0}
      />
      <div className="dialog-buttons-container">
        <Button
          variant="outlined"
          color="gray"
          className="dialog-button"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <LoadingButton
          variant="contained"
          color="secondary"
          className="dialog-button"
          onClick={onSave}
          disabled={name.length === 0}
          loading={loading}
        >
          Modificar
        </LoadingButton>
      </div>
    </div>
  </Dialog>
);
