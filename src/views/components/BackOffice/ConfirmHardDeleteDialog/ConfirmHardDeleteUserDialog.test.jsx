import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ConfirmHardDeleteUserDialog from './ConfirmHardDeleteUserDialog';

describe('ConfirmHardDeleteUserDialog', () => {
  it('renders dialog and handles confirmation', async () => {

    const handleCloseDeleteUserConfirmation = jest.fn();
    const refetchUsers = jest.fn();
    const hardDeleteUser = jest.fn().mockResolvedValue({ data: { deleteUser: { id: 'user-id-1' } } });

    const { getByText, getByRole } = render(
      <ConfirmHardDeleteUserDialog
        openDeleteUserConfirmation={true}
        handleCloseDeleteUserConfirmation={handleCloseDeleteUserConfirmation}
        selectedUser={{ id: 'user-id-1' }}
        refetchUsers={refetchUsers}
      />
    );

    expect(getByText('Eliminar usuario')).toBeInTheDocument();
    expect(getByText('¿Está seguro de que desea eliminar este usuario de manera permanente?')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(hardDeleteUser).toHaveBeenCalledWith({ variables: { id: 'user-id-1' } });
    });

    await waitFor(() => {
      expect(refetchUsers).toHaveBeenCalled();
    });

    expect(handleCloseDeleteUserConfirmation).toHaveBeenCalled();
  });

  it('handles cancellation', async () => {

    const handleCloseDeleteUserConfirmation = jest.fn();
    const refetchUsers = jest.fn();
    const hardDeleteUser = jest.fn().mockResolvedValue({ data: { deleteUser: { id: 'user-id-1' } } });

    const { getByRole } = render(
      <ConfirmHardDeleteUserDialog
        openDeleteUserConfirmation={true}
        handleCloseDeleteUserConfirmation={handleCloseDeleteUserConfirmation}
        selectedUser={{ id: 'user-id-1' }}
        refetchUsers={refetchUsers}
      />
    );

    fireEvent.click(getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => {
      expect(hardDeleteUser).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(refetchUsers).not.toHaveBeenCalled();
    });

    expect(handleCloseDeleteUserConfirmation).toHaveBeenCalled();
  });
});
