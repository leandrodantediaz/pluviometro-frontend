import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import { DELETE_USER } from '../../../../data/graphQL/mutations/deleteUser/deleteUser';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { UserBackOffice } from './UserBackOffice';

describe('UserBackOffice', () => {
  const mocks = [
    {
      request: {
        query: GET_ALL_USERS,
        variables: { skip: 0, take: 10 },
      },
      result: {
        data: {
          allUsers: {
            items: [
              { id: 'user-id-1', fullName: 'John Doe', email: 'john.doe@example.com', planId: 'plan-id-1', rol: { name: 'Administrator' }, disabled: false },
              { id: 'user-id-2', fullName: 'Jane Smith', email: 'jane.smith@example.com', planId: 'plan-id-2', rol: { name: 'User' }, disabled: true },
            ],
            totalCount: 2,
          },
        },
      },
    },
    {
      request: {
        query: GET_ALL_PLANS,
        variables: { filterInput: { disabled: { eq: false } }, skip: 0, take: 100 },
      },
      result: {
        data: {
          allPlans: {
            items: [
              { id: 'plan-id-1', name: 'Plan 1' },
              { id: 'plan-id-2', name: 'Plan 2' },
            ],
          },
        },
      },
    },
    {
      request: {
        query: DELETE_USER,
        variables: { id: 'user-id-1' },
      },
      result: { data: { deleteUser: { id: 'user-id-1' } } },
    },
  ];
  
  it('renders UserBackOffice correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserBackOffice />
      </MockedProvider>
    );
  
    await waitFor(() => expect(screen.queryByTestId('circular-progress')).toBeNull());

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Eliminar'));

    await waitFor(() => fireEvent.click(screen.getByText('Confirmar')));
  
    await waitFor(() => expect(screen.queryByText('John Doe')).toBeNull());
  });
  
  it('handles pagination correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserBackOffice />
      </MockedProvider>
    );

    await waitFor(() => expect(screen.queryByTestId('circular-progress')).toBeNull());

    fireEvent.click(screen.getByLabelText('Next page'));

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles conditional rendering and state updates', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserBackOffice />
      </MockedProvider>
    );
  
    await waitFor(() => expect(screen.queryByTestId('circular-progress')).toBeNull());

    expect(screen.getByText('Conditional Text')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle State'));

    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
