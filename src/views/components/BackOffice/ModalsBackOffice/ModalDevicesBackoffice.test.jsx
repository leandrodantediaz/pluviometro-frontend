import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useTheme } from '@mui/material/styles';
import { ModalDevicesBackoffice } from './ModalDevicesBackoffice';
import { ADD_DEVICE } from '../../../../data/graphQL/mutations/addDevicesBackoffice/addDevicesBackoffice';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';

jest.mock('@mui/material/styles', () => { return {
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn(),
}; });

const mockRefetchDevicesTable = jest.fn();

const usersMock = {
  request: {
    query: GET_ALL_USERS,
    variables: {
      filterInput: { disabled: { eq: false }, rol: { name: { eq: 'Administrator' } } },
      skip: 0,
      take: 100,
    },
  },
  result: {
    data: {
      allUsers: {
        items: [
          { id: '1', fullName: 'User One', disabled: false },
          { id: '2', fullName: 'User Two', disabled: false },
        ],
      },
    },
  },
};

const addDeviceMock = {
  request: {
    query: ADD_DEVICE,
    variables: {
      deviceInput: {
        deviceName: 'Test Device',
        displayName: 'Test User',
        password: 'password',
        serialNumber: '12345',
        userId: '1',
      },
    },
  },
  result: {
    data: {
      addDevice: {
        id: '1',
        deviceName: 'Test Device',
        displayName: 'Test User',
        serialNumber: '12345',
        user: {
          id: '1',
          fullName: 'User One',
        },
      },
    },
  },
};

describe('ModalDevicesBackoffice', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({
      breakpoints: {
        down: jest.fn().mockReturnValue('@media (max-width:600px)'),
      },
    });
  });

  it('renders ModalDevicesBackoffice and opens modal on button click', async () => {
    render(
      <MockedProvider mocks={[ usersMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    const openButton = screen.getByText('Agregar Dispositivos');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Agregar Dispositivos')).toBeInTheDocument();
    });
  });

  it('displays form fields and allows user input', async () => {
    render(
      <MockedProvider mocks={[ usersMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    await waitFor(() => {
      expect(screen.getByLabelText('Número de Serie')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Número de Serie'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Etiqueta del dispositivo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Device name'), { target: { value: 'Test Device' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });

    expect(screen.getByLabelText('Número de Serie').value).toBe('12345');
    expect(screen.getByLabelText('Etiqueta del dispositivo').value).toBe('Test User');
    expect(screen.getByLabelText('Device name').value).toBe('Test Device');
    expect(screen.getByLabelText('Contraseña').value).toBe('password');
  });

  it('validates form and displays errors on empty fields', async () => {
    render(
      <MockedProvider mocks={[ usersMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));
    fireEvent.click(screen.getByText('Agregar Dispositivo'));

    await waitFor(() => {
      expect(screen.getByLabelText('Número de Serie')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Etiqueta del dispositivo')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Device name')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Contraseña')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('handles user loading error', async () => {
    const usersErrorMock = {
      request: {
        query: GET_ALL_USERS,
        variables: {
          filterInput: { disabled: { eq: false }, rol: { name: { eq: 'Administrator' } } },
          skip: 0,
          take: 100,
        },
      },
      error: new Error('Error loading users'),
    };

    render(
      <MockedProvider mocks={[ usersErrorMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    await waitFor(() => {
      expect(screen.getByText('Error al cargar usuarios')).toBeInTheDocument();
    });
  });

  it('submits form data and calls addDevice mutation', async () => {
    render(
      <MockedProvider mocks={[ usersMock, addDeviceMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    await waitFor(() => {
      expect(screen.getByLabelText('Número de Serie')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Número de Serie'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Etiqueta del dispositivo'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Device name'), { target: { value: 'Test Device' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });

    fireEvent.change(screen.getByLabelText('selectedUserId'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Agregar Dispositivo'));

    await waitFor(() => {
      expect(mockRefetchDevicesTable).toHaveBeenCalled();
    });
  });

  it('closes the modal and resets form data on cancel', async () => {
    render(
      <MockedProvider mocks={[ usersMock ]}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    await waitFor(() => {
      expect(screen.getByLabelText('Número de Serie')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Número de Serie'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Etiqueta del dispositivo'), { target: { value: 'Test User' } });

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Número de Serie')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    await waitFor(() => {
      expect(screen.getByLabelText('Número de Serie').value).toBe('');
      expect(screen.getByLabelText('Etiqueta del dispositivo').value).toBe('');
    });
  });

  it('displays loading state while users are loading', async () => {
    render(
      <MockedProvider mocks={[ usersMock ]} addTypename={false}>
        <ModalDevicesBackoffice refetchDevicesTable={mockRefetchDevicesTable} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Agregar Dispositivos'));

    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });
});
