import React from 'react';
import { useMutation } from '@apollo/client';
import { Dialog, Button} from '@mui/material';
import { HARD_DELETE_USER } from '../../../../data/graphQL/mutations/hardDeleteUser/hardDeleteUser';

const ConfirmHardDeleteUserDialog = ({ openDeleteUserConfirmation, handleCloseDeleteUserConfirmation,
  selectedUser, refetchUsers }) => {
  const [ hardDeleteUser, { loading } ] = useMutation(HARD_DELETE_USER, {
    onCompleted: () => {
      refetchUsers(); 
      handleCloseDeleteUserConfirmation();
    },
  });

  const handleHardDeleteUser = async () => {
    await hardDeleteUser({ variables: { id: selectedUser.id } });
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
        <div>¿Está seguro de que desea eliminar este usuario de manera permanente?</div>
        <div className="header-dialog-buttons-container">
          <Button
            variant="outlined"
            color="gray"
            className="dialog-button"
            onClick={handleCloseDeleteUserConfirmation}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="dialog-button"
            onClick={handleHardDeleteUser}
            disabled={loading}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmHardDeleteUserDialog;
