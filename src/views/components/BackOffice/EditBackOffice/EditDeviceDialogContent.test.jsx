import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EditDeviceDialogContent from './EditDeviceDialogContent';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { EDIT_DEVICE } from '../../../../data/graphQL/mutations/editDevices/editDevices';

const selectedDeviceMock = {
  id: 'device-id-1',
  name: 'Device 1',
  userName: 'User 1',
  password: 'password123',
  serialNumber: 'SN123456',
  owner: {
    id: 'user-id-1',
    fullName: 'John Doe',
  },
  disabled: false,
};

const usersDataMock = {
  allUsers: {
    items: [
      { id: 'user-id-1', fullName: 'John Doe' },
      { id: 'user-id-2', fullName: 'Jane Smith' },
    ],
  },
};

const mocks = [
  {
    request: {
      query: GET_ALL_USERS,
      variables: {
        filterInput: { disabled: { eq: false }, rol: { name: { eq: 'Administrator' } } },
        skip: 0,
        take: 100,
      },
    },
    result: { data: usersDataMock },
  },
  {
    request: {
      query: EDIT_DEVICE,
      variables: {
        id: selectedDeviceMock.id,
        deviceName: selectedDeviceMock.name,
        displayName: selectedDeviceMock.userName,
        password: selectedDeviceMock.password,
        serialNumber: selectedDeviceMock.serialNumber,
        ownerId: parseInt(selectedDeviceMock.owner.id, 10),
      },
    },
    result: jest.fn().mockResolvedValue({ data: {} }),
  },
];

describe('EditDeviceDialogContent', () => {
  it('renders with selected device data', () => {
    const handleCloseEditDeviceDialog = jest.fn();
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditDeviceDialogContent
          selectedDevice={selectedDeviceMock}
          handleCloseEditDeviceDialog={handleCloseEditDeviceDialog}
        />
      </MockedProvider>
    );

    expect(getByTestId('device-username')).toHaveValue('User 1');
    expect(getByTestId('device-name')).toHaveValue('Device 1');
    expect(getByTestId('device-password')).toHaveValue('password123');
    expect(getByTestId('device-serial-number')).toHaveValue('SN123456');
    expect(getByTestId('device-owner')).toHaveTextContent('John Doe');
  });

  it('disables form fields when device is disabled', () => {
    const handleCloseEditDeviceDialog = jest.fn();
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditDeviceDialogContent
          selectedDevice={{ ...selectedDeviceMock, disabled: true }}
          handleCloseEditDeviceDialog={handleCloseEditDeviceDialog}
        />
      </MockedProvider>
    );

    expect(getByTestId('device-username')).toBeDisabled();
    expect(getByTestId('device-name')).toBeDisabled();
    expect(getByTestId('device-password')).toBeDisabled();
    expect(getByTestId('device-serial-number')).toBeDisabled();
    expect(getByTestId('device-owner')).toBeDisabled();
  });

  it('handles form submission', async () => {
    const handleCloseEditDeviceDialog = jest.fn();
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditDeviceDialogContent
          selectedDevice={selectedDeviceMock}
          handleCloseEditDeviceDialog={handleCloseEditDeviceDialog}
        />
      </MockedProvider>
    );

    fireEvent.change(getByTestId('device-username'), { target: { value: 'Updated User' } });
    fireEvent.change(getByTestId('device-name'), { target: { value: 'Updated Device' } });
    fireEvent.change(getByTestId('device-password'), { target: { value: 'newpassword' } });
    fireEvent.change(getByTestId('device-serial-number'), { target: { value: 'SN654321' } });

    fireEvent.click(getByText('Guardar'));

    await waitFor(() => {
      expect(handleCloseEditDeviceDialog).toHaveBeenCalled();
      expect(mocks[1].result).toHaveBeenCalledWith({
        data: {
          editDevice: {
            id: selectedDeviceMock.id,
            deviceName: 'Updated Device',
            displayName: 'Updated User',
            password: 'newpassword',
            serialNumber: 'SN654321',
            ownerId: parseInt(selectedDeviceMock.owner.id, 10),
          },
        },
      });
    });
  });

  it('handles form submission with empty fields', async () => {
    const handleCloseEditDeviceDialog = jest.fn();
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EditDeviceDialogContent
          selectedDevice={selectedDeviceMock}
          handleCloseEditDeviceDialog={handleCloseEditDeviceDialog}
        />
      </MockedProvider>
    );

    fireEvent.change(getByTestId('device-username'), { target: { value: '' } });
    fireEvent.change(getByTestId('device-name'), { target: { value: '' } });
    fireEvent.change(getByTestId('device-password'), { target: { value: '' } });
    fireEvent.change(getByTestId('device-serial-number'), { target: { value: '' } });

    fireEvent.click(getByText('Guardar'));

    await waitFor(() => {
      expect(handleCloseEditDeviceDialog).toHaveBeenCalled();
      expect(mocks[1].result).not.toHaveBeenCalled();
    });
  });
});
