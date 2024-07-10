import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ModalPlansBackoffice from './ModalPlansBackoffice';
import { ADD_PLAN } from '../../../../data/graphQL/mutations/addPlanBackoffice/addPlanBackoffice';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';

const mocks = [
  {
    request: {
      query: ADD_PLAN,
      variables: {
        planInput: {
          name: 'Nuevo Plan',
          maxAllowedUsers: 10,
        },
      },
    },
    result: {
      data: {
        addPlan: {
          id: '1',
          name: 'Nuevo Plan',
          maxAllowedUsers: 10,
        },
      },
    },
  },
  {
    request: {
      query: GET_ALL_PLANS,
      variables: {
        filterInput: { disabled: { eq: false } },
        skip: 0,
        take: 100,
      },
    },
    result: {
      data: {
        allPlans: {
          items: [
            { id: '1', name: 'Plan 1', maxAllowedUsers: 5 },
            { id: '2', name: 'Plan 2', maxAllowedUsers: 10 },
          ],
        },
      },
    },
  },
];

describe('ModalPlansBackoffice', () => {
  it('renders ModalPlansBackoffice correctly and adds a new plan', async () => {
    const { getByText, getByLabelText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ModalPlansBackoffice refetchPlansTable={() => {}} />
      </MockedProvider>
    );

    fireEvent.click(getByText('Agregar Planes'));
    expect(getByText('Agregar Planes')).toBeInTheDocument();

    fireEvent.change(getByLabelText('Nombre de Plan'), { target: { value: 'Nuevo Plan' } });
    fireEvent.change(getByLabelText('Cantidad Máxima de Usuarios Permitidos'), { target: { value: '10' } });

    fireEvent.click(getByText('Agregar Plan'));

    await waitFor(() => {
      expect(getByText('Agregar Plan')).toBeDisabled(); 
    });

    expect(mocks[0].request.variables).toEqual({
      planInput: {
        name: 'Nuevo Plan',
        maxAllowedUsers: 10,
      },
    });
    expect(mocks[1].request.variables).toEqual({
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    });

    const modal = document.querySelector('.MuiDialog-root');
    expect(modal).not.toBeInTheDocument();
  });
});
