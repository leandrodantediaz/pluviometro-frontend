import React from 'react';
import { useMutation } from '@apollo/client';
import { Dialog, Button} from '@mui/material';
import { HARD_DELETE_PLAN } from '../../../../data/graphQL/mutations/hardDeletePlans/hardDeletePlans';

const ConfirmHardDeletePlanDialog = ({
  openDeletePlanConfirmation,
  handleCloseDeletePlanConfirmation,
  selectedPlan,
  refetchPlans,
}) => {
  const [ hardDeletePlan, { loading } ] = useMutation(HARD_DELETE_PLAN, {
    onCompleted: () => {
      refetchPlans();
      handleCloseDeletePlanConfirmation();
    },
  });

  const handleHardDeletePlan = async () => {
    await hardDeletePlan({ variables: { id: selectedPlan.id } });
  };
  

  return (
    <Dialog
      open={openDeletePlanConfirmation}
      onClose={handleCloseDeletePlanConfirmation}
      maxWidth="sm"
      fullWidth
    >
      <div className="header-dialog-body">
        <div className="dialog-title">Confirmar eliminación de plan</div>
        <div>¿Está seguro de que desea eliminar este plan de manera permanente?</div>
        <div className="header-dialog-buttons-container">
          <Button
            variant="outlined"
            color="gray"
            className="dialog-button"
            onClick={handleCloseDeletePlanConfirmation}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="dialog-button"
            onClick={handleHardDeletePlan}
            disabled={loading}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmHardDeletePlanDialog;
