import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PlanBackOffice } from './PlanBackOffice';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import { DELETE_PLAN } from '../../../../data/graphQL/mutations/deletePlans/deletePlan';
import { EDIT_PLAN } from '../../../../data/graphQL/mutations/editPlan/editPlan';

const plansMockData = {
  allPlans: {
    items: [
      { id: 'plan-id-1', name: 'Plan 1', maxAllowedUsers: 5, disabled: false },
      { id: 'plan-id-2', name: 'Plan 2', maxAllowedUsers: 10, disabled: true },
    ],
    totalCount: 2,
  },
};

const mocks = [
  {
    request: {
      query: GET_ALL_PLANS,
      variables: { skip: 0, take: 10 },
    },
    result: { data: plansMockData },
  },
  {
    request: {
      query: DELETE_PLAN,
      variables: { id: 'plan-id-1' },
    },
    result: jest.fn().mockResolvedValue({ data: {} }),
  },
  {
    request: {
      query: EDIT_PLAN,
      variables: { id: 'plan-id-1', name: 'Updated Plan', maxAllowedUsers: 8 },
    },
    result: jest.fn().mockResolvedValue({ data: {} }),
  },
];

describe('PlanBackOffice', () => {
  it('renders plans table and handles interactions', async () => {
    const setRefetchMock = jest.fn();
    const { getByText, getByLabelText, getByRole, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <PlanBackOffice setRefetch={setRefetchMock} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Plan 1')).toBeInTheDocument();
      expect(getByText('Plan 2')).toBeInTheDocument();
    });

    fireEvent.click(getByRole('button', { name: 'DetailsIcon' }));

    fireEvent.click(getByText('Editar'));
    fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Updated Plan' } });
    fireEvent.change(getByLabelText('Máximo de usuarios invitados'), { target: { value: '8' } });
    fireEvent.click(getByText('Guardar'));

    await waitFor(() => {
      expect(queryByText('Editar')).toBeNull();
      expect(setRefetchMock).toHaveBeenCalledTimes(1); 
    });

    fireEvent.click(getByRole('button', { name: 'DetailsIcon' }));
    fireEvent.click(getByText('Eliminar'));

    fireEvent.click(getByText('Confirmar'));

    await waitFor(() => {
      expect(queryByText('Eliminar')).toBeNull(); 
      expect(setRefetchMock).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(getByText('Deshabilitar'));

    await waitFor(() => {
      expect(setRefetchMock).toHaveBeenCalledTimes(3); 
    });

    fireEvent.click(getByRole('button', { name: 'DetailsIcon' })); 
    fireEvent.click(getByText('Cancelar')); 
    fireEvent.click(getByRole('button', { name: 'DetailsIcon' })); 
    fireEvent.click(getByText('Editar')); 
    fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Updated Plan' } });
    fireEvent.change(getByLabelText('Máximo de usuarios invitados'), { target: { value: '8' } });
    fireEvent.click(getByText('Cancelar')); 
    fireEvent.click(getByRole('button', { name: 'DetailsIcon' })); 

  });
});
