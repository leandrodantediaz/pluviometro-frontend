import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useMutation } from '@apollo/client';
import ConfirmHardDeletePlanDialog from './confirmHardDeletePlanDialog';

jest.mock('@apollo/client', () => {
  const actualApolloClient = jest.requireActual('@apollo/client');
  return {
    ...actualApolloClient,
    useMutation: jest.fn(),
  };
});

describe('ConfirmHardDeletePlanDialog', () => {
  it('renders with confirmation message', () => {
    const { getByText } = render(
      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={true}
        handleCloseDeletePlanConfirmation={() => {}}
        selectedPlan={{ id: 'plan-1' }}
        refetchPlans={() => {}}
      />
    );

    expect(getByText('Confirmar eliminación de plan')).toBeInTheDocument();
    expect(
      getByText('¿Está seguro de que desea eliminar este plan de manera permanente?')
    ).toBeInTheDocument();
  });

  it('calls handleCloseDeletePlanConfirmation on Cancel button click', async () => {
    const handleClose = jest.fn();
    const { getByText } = render(
      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={true}
        handleCloseDeletePlanConfirmation={handleClose}
        selectedPlan={{ id: 'plan-1' }}
        refetchPlans={() => {}}
      />
    );

    const cancelButton = getByText('Cancelar');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls handleHardDeletePlan and refetchPlans on Confirm button click', async () => {
    const handleDelete = jest.fn();
    const refetchPlans = jest.fn();

    useMutation.mockReturnValue([
      handleDelete,
      { loading: false },
    ]);

    const { getByText } = render(
      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={true}
        handleCloseDeletePlanConfirmation={() => {}}
        selectedPlan={{ id: 'plan-1' }}
        refetchPlans={refetchPlans}
      />
    );

    const confirmButton = getByText('Confirmar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith({ variables: { id: 'plan-1' } });
      expect(refetchPlans).toHaveBeenCalledTimes(1);
    });
  });

  it('disables buttons when loading is true', () => {
    const { getByText } = render(
      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={true}
        handleCloseDeletePlanConfirmation={() => {}}
        selectedPlan={{ id: 'plan-1' }}
        refetchPlans={() => {}}
        loading={true}
      />
    );

    const cancelButton = getByText('Cancelar');
    const confirmButton = getByText('Confirmar');

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('executes hardDeletePlan, refetchPlans, and handleCloseDeletePlanConfirmation in order', async () => {
    const handleDelete = jest.fn();
    const refetchPlans = jest.fn();
    const handleClose = jest.fn();

    useMutation.mockReturnValue([
      handleDelete,
      { loading: false },
    ]);

    const { getByText } = render(
      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={true}
        handleCloseDeletePlanConfirmation={handleClose}
        selectedPlan={{ id: 'plan-1' }}
        refetchPlans={refetchPlans}
      />
    );

    const confirmButton = getByText('Confirmar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith({ variables: { id: 'plan-1' } });
      expect(refetchPlans).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
