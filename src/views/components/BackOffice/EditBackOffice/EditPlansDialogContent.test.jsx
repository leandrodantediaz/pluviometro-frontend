import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditPlansDialogContent from './EditPlansDialogContent';

describe('EditPlansDialogContent', () => {
  const formData = {
    name: 'Plan de prueba',
    maxAllowedUsers: 10,
  };

  const handleFormChange = jest.fn();
  const handleSubmit = jest.fn();
  const handleClose = jest.fn();

  it('renders EditPlansDialogContent correctly', async () => {
    const { getByLabelText, getByRole, getByText } = render(
      <EditPlansDialogContent
        open={true}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        formData={formData}
        handleFormChange={handleFormChange}
        loading={false}
      />
    );

    expect(getByText('Editar plan')).toBeInTheDocument(); 

    expect(getByLabelText('Nombre')).toHaveValue('Plan de prueba');
    expect(getByLabelText('Máximo de usuarios invitados')).toHaveValue('10');

    fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Nuevo nombre de plan' } });
    fireEvent.change(getByLabelText('Máximo de usuarios invitados'), { target: { value: '15' } });

    await waitFor(() => {
      expect(handleFormChange).toHaveBeenCalledTimes(2); 
      expect(handleFormChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'name', value: 'Nuevo nombre de plan' } }));
      expect(handleFormChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'maxAllowedUsers', value: '15' } }));
    });

    fireEvent.submit(getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });

    fireEvent.click(getByRole('button', { name: 'Cancelar' }));

    expect(handleClose).toHaveBeenCalled();
  });

  it('disables form submission when loading', async () => {
    const { getByRole } = render(
      <EditPlansDialogContent
        open={true}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        formData={formData}
        handleFormChange={handleFormChange}
        loading={true}
      />
    );

    fireEvent.submit(getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });
});
