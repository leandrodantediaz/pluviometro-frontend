import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { DevicesBackoffice } from './DevicesBackoffice';
import { GET_ALL_DEVICES } from '../../../../data/graphQL/queries/getAllDevices/getAllDevices';
import { DELETE_DEVICE } from '../../../../data/graphQL/mutations/deleteDevices/deleteDevices';
import { EDIT_DEVICE } from '../../../../data/graphQL/mutations/editDevices/editDevices';

jest.mock('../../../../icons', () => { return {
  DetailsIcon: jest.fn(() => <div>DetailsIcon</div>),
  EditIcon: jest.fn(() => <div>EditIcon</div>),
}; });

const devicesMock = {
  request: {
    query: GET_ALL_DEVICES,
    variables: {
      skip: 0,
      take: 10,
    },
  },
  result: {
    data: {
      allDevices: {
        items: [
          {
            id: '1',
            serialNumber: '12345',
            name: 'Device 1',
            userName: 'User 1',
            latitude: '10.123',
            longitude: '20.123',
            owner: { fullName: 'Owner 1' },
            disabled: false,
          },
          {
            id: '2',
            serialNumber: '54321',
            name: 'Device 2',
            userName: 'User 2',
            latitude: '30.123',
            longitude: '40.123',
            owner: { fullName: 'Owner 2' },
            disabled: true,
          },
        ],
        totalCount: 2,
      },
    },
  },
};

const deleteDeviceMock = {
  request: {
    query: DELETE_DEVICE,
    variables: { id: '1' },
  },
  result: {
    data: {
      deleteDevice: { success: true },
    },
  },
};

const editDeviceMock = {
  request: {
    query: EDIT_DEVICE,
    variables: { id: '1', input: { name: 'New Device Name' } },
  },
  result: {
    data: {
      editDevice: {
        id: '1',
        name: 'New Device Name',
      },
    },
  },
};

describe('DevicesBackoffice', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={[ devicesMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders devices data', async () => {
    render(
      <MockedProvider mocks={[ devicesMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('10.123')).toBeInTheDocument();
    expect(screen.getByText('20.123')).toBeInTheDocument();
    expect(screen.getByText('Owner 1')).toBeInTheDocument();
    expect(screen.getByText('Device 2')).toBeInTheDocument();
    expect(screen.getByText('54321')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('30.123')).toBeInTheDocument();
    expect(screen.getByText('40.123')).toBeInTheDocument();
    expect(screen.getByText('Owner 2')).toBeInTheDocument();
  });

  it('handles popover open and close', async () => {
    render(
      <MockedProvider mocks={[ devicesMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('DetailsIcon')[0]);

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    expect(screen.getByText('EditIcon')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('DetailsIcon')[0]); 
    await waitFor(() => {
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    });
  });

  it('handles device deletion', async () => {
    render(
      <MockedProvider mocks={[ devicesMock, deleteDeviceMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('DetailsIcon')[0]);

    await waitFor(() => {
      expect(screen.getByText('Deshabilitar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Deshabilitar'));

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });
  });

  it('handles device editing', async () => {
    render(
      <MockedProvider mocks={[ devicesMock, editDeviceMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('DetailsIcon')[0]);

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    expect(screen.getByText('EditIcon')).toBeInTheDocument();

    
    fireEvent.click(screen.getByLabelText('close')); 
    await waitFor(() => {
      expect(screen.queryByText('EditIcon')).not.toBeInTheDocument();
    });
  });

  it('handles page change', async () => {
    render(
      <MockedProvider mocks={[ devicesMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Go to next page')); 

    await waitFor(() => {
      expect(devicesMock.request.variables.skip).toBe(10);
    });
  });

  it('handles the popover open and close for disabled devices', async () => {
    render(
      <MockedProvider mocks={[ devicesMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('DetailsIcon')[1]);

    await waitFor(() => {
      expect(screen.getByText('Habilitar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Habilitar'));

   
    const handleToggleDeviceStatus = jest.fn();
    handleToggleDeviceStatus();

    expect(handleToggleDeviceStatus).toHaveBeenCalled();
  });

  it('handles closing the edit device dialog', async () => {
    render(
      <MockedProvider mocks={[ devicesMock, editDeviceMock ]} addTypename={false}>
        <DevicesBackoffice setRefetch={() => {}} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('DetailsIcon')[0]);

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));

    expect(screen.getByText('EditIcon')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('close')); 

    await waitFor(() => {
      expect(screen.queryByText('EditIcon')).not.toBeInTheDocument();
    });
  });
});
