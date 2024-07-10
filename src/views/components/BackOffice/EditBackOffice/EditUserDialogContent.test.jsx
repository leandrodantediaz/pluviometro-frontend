import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditUserDialogContent from './EditUserDialogContent';
import { MockedProvider } from '@apollo/client/testing';
import { EDIT_USER } from '../../../../data/graphQL/mutations/editUser/editUser';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';

describe('EditUserDialogContent', () => {
  const selectedUser = {
    id: 'user-id-1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    planId: 'plan-id-1',
    rol: { id: 'rol-id-1' },
    cuit: '12345678901',
    phone: '123456789',
  };

  const plansDataMock = {
    allPlans: {
      items: [
        { id: 'plan-id-1', name: 'Plan 1' },
        { id: 'plan-id-2', name: 'Plan 2' },
      ],
    },
  };

  const mocks = [
    {
      request: {
        query: EDIT_USER,
        variables: {
          planId: 'plan-id-2',
          id: 'user-id-1',
          email: 'updated.email@example.com',
          cuit: '12345678901',
          phone: '123456789',
          lastName: 'Updated Last Name',
          name: 'Updated Name',
          rolId: 'rol-id-1',
        },
      },
      result: { data: { editUser: { id: 'user-id-1' } } },
    },
    {
      request: {
        query: GET_ALL_PLANS,
        variables: { filterInput: { disabled: { eq: false } }, skip: 0, take: 100 },
      },
      result: { data: plansDataMock },
    },
  ];

  it('renders EditUserDialogContent correctly', async () => {
    const handleCloseEditUserDialog = jest.fn();

    const { getByLabelText, getByRole, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditUserDialogContent
          openEditUserDialog={true}
          handleCloseEditUserDialog={handleCloseEditUserDialog}
          selectedUser={selectedUser}
          setIsUpdated={jest.fn()}
        />
      </MockedProvider>
    );

    expect(getByText('Editar usuario')).toBeInTheDocument();

    expect(getByLabelText('Nombre')).toHaveValue('John');
    expect(getByLabelText('Apellido')).toHaveValue('Doe');
    expect(getByLabelText('Email')).toHaveValue('john.doe@example.com');
    expect(getByLabelText('Nombre del plan')).toHaveTextContent('Plan 1');

    fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Updated Name' } });
    fireEvent.change(getByLabelText('Apellido'), { target: { value: 'Updated Last Name' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'updated.email@example.com' } });

    expect(getByLabelText('Nombre')).toHaveValue('Updated Name');
    expect(getByLabelText('Apellido')).toHaveValue('Updated Last Name');
    expect(getByLabelText('Email')).toHaveValue('updated.email@example.com');

    fireEvent.change(getByLabelText('Nombre del plan'), { target: { value: 'plan-id-2' } });

    await waitFor(() => {
      expect(getByLabelText('Nombre del plan')).toHaveTextContent('Plan 2');
    });

    fireEvent.submit(getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(handleCloseEditUserDialog).toHaveBeenCalled();
    });
  });
});
