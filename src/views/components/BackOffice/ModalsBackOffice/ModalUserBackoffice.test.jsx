import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useTheme } from '@mui/material/styles';
import { ADD_USER } from '../../../../data/graphQL/mutations/addUserBackoffice/addUserBackoffice';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import { ModalUserBackoffice } from './ModalUserBackoffice';

jest.mock('@mui/material/styles', () => { return {
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn(),
}; });

const mockRefetchUsersTable = jest.fn();

const plansMock = {
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
          { id: 1, name: 'Plan A' },
          { id: 2, name: 'Plan B' },
        ],
      },
    },
  },
};

const addUserMock = {
  request: {
    query: ADD_USER,
    variables: {
      input: {
        fullName: 'John Doe',
        cuit: '123456789',
        phone: '1234567890',
        email: 'john.doe@example.com',
        planId: 1,
      },
    },
  },
  result: {
    data: {
      addUser: {
        id: '1',
        fullName: 'John Doe',
        cuit: '123456789',
        phone: '1234567890',
        email: 'john.doe@example.com',
        plan: {
          id: 1,
          name: 'Plan A',
        },
      },
    },
  },
};

describe('ModalUserBackoffice', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({
      breakpoints: {
        down: jest.fn().mockReturnValue('@media (max-width:600px)'),
      },
    });
  });

  it('renders ModalUserBackoffice and opens modal on button click', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    const openButton = screen.getByText('Agregar Usuarios');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Agregar Usuarios')).toBeInTheDocument();
    });
  });

  it('displays form fields and allows user input', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('CUIT'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('plan'), { target: { value: '1' } });

    expect(screen.getByLabelText('Nombre').value).toBe('John');
    expect(screen.getByLabelText('Apellido').value).toBe('Doe');
    expect(screen.getByLabelText('CUIT').value).toBe('123456789');
    expect(screen.getByLabelText('Teléfono').value).toBe('1234567890');
    expect(screen.getByLabelText('Correo Electrónico').value).toBe('john.doe@example.com');
    expect(screen.getByLabelText('plan').value).toBe('1');
  });

  it('validates form and displays errors on empty fields', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));
    fireEvent.click(screen.getByText('Agregar Usuario'));

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Apellido')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('CUIT')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Teléfono')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Correo Electrónico')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('plan')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('handles email validation correctly', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Agregar Usuario'));

    await waitFor(() => {
      expect(screen.getByLabelText('Correo Electrónico')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('submits form data and calls addUser mutation', async () => {
    render(
      <MockedProvider mocks={[ plansMock, addUserMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('CUIT'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('plan'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Agregar Usuario'));

    await waitFor(() => {
      expect(mockRefetchUsersTable).toHaveBeenCalled();
    });
  });

  it('handles plan loading error', async () => {
    const plansErrorMock = {
      request: {
        query: GET_ALL_PLANS,
        variables: {
          filterInput: { disabled: { eq: false } },
          skip: 0,
          take: 100,
        },
      },
      error: new Error('Error loading plans'),
    };

    render(
      <MockedProvider mocks={[ plansErrorMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByText('Error al cargar planes')).toBeInTheDocument();
    });
  });

  it('closes the modal and resets form data on cancel', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre').value).toBe('');
      expect(screen.getByLabelText('Apellido').value).toBe('');
    });
  });

  it('displays loading state while plans are loading', async () => {
    render(
      <MockedProvider mocks={[ plansMock ]} addTypename={false}>
        <ModalUserBackoffice refetchUsersTable={mockRefetchUsersTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Usuarios'));

    expect(screen.getByText('Cargando planes...')).toBeInTheDocument();
  });
});
