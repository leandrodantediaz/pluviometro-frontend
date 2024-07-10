import React from 'react';
import { fireEvent, render, waitFor } from '../../../../testUtils/renderUtils';
import { MockedProvider } from '@apollo/client/testing';
import { DeviceDetail } from './DeviceDetail';
import { changeDeviceNameMocks } from '../../../data/graphQL/mocks/mutations/changeDeviceName/changeDeviceNameMocks';

describe('DeviceDetail', () => {
  const deviceMock = {
    id: '1',
    name: 'Test Device',
    serialNumber: '123456',
    position: { lat: 123, lng: 456 },
    modificationDate: '2024-05-30',
  };

  const filters = {
    devices: [ deviceMock ],
    selectedDevices: [ deviceMock.id ],
    calendarType: 'Agrícola',
    periodicity: 'diaria',
    monthlyGroupBy: 'Días',
  };

  const defaultProps = {
    device: deviceMock,
    showActions: true,
    graphFilterProps: {
      filters,
      temporalFilters: filters,
      filterDialogOpen: false, 
      handleFilterChange: jest.fn(),
      handleSaveFilters: jest.fn(),
      handleResetFilters: jest.fn(),
      openFilterDialog: jest.fn(),
      closeFilterDialog: jest.fn() 
    },
    loadingDevice: false,
  };

  const setup = ({
    props = defaultProps,
    mocks = [],
  } = {}) => 
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeviceDetail {...props} />
      </MockedProvider>
    );
  ;

  it('renders device details correctly', () => {
    const { getByText } = setup();

    expect(getByText(deviceMock.name)).toBeInTheDocument();
    expect(getByText(deviceMock.serialNumber)).toBeInTheDocument();
    expect(getByText(`"lat": ${deviceMock.position.lat}, "long": ${deviceMock.position.lng}`)).toBeInTheDocument();
    expect(getByText(`última actualización ${deviceMock.modificationDate}`)).toBeInTheDocument();
  });

  it('does not render device detail when loading', () => {
    const { queryByText } = setup({ props: { ...defaultProps, loadingDevice: true } });

    expect(queryByText(deviceMock.name)).toBeNull();
    expect(queryByText(deviceMock.serialNumber)).toBeNull();
    expect(queryByText(`"lat": ${deviceMock.position.lat}, "long": ${deviceMock.position.lng}`)).toBeNull();
    expect(queryByText(`última actualización ${deviceMock.modificationDate}`)).toBeNull();
  });

  it('displays edit dialog when edit icon is clicked', async () => {
    const { getByTestId, getByText } = setup();
    const editIcon = getByTestId('edit-icon');
    fireEvent.click(editIcon);
    
    await waitFor(() => {
      const editPluviometerNameDialogTitle = getByText('Modificar nombre');
      expect(editPluviometerNameDialogTitle).toBeInTheDocument();
    });
  });

  it('changes device name correctly', async () => {
    const { getByTestId, getByText, getByRole } = setup({ mocks: changeDeviceNameMocks });

    fireEvent.click(getByTestId('edit-icon'));
    fireEvent.change(getByRole('textbox', { value: deviceMock.name }), {
      target: { value: 'New Device Name' },
    });
    fireEvent.click(getByText('Modificar'));

    await waitFor(() => {
      expect(getByText('New Device Name')).toBeInTheDocument();
    });
  });

  it('disables "Modificar" button when trying to change device name to empty', async () => {
    const { getByTestId, getByRole, getByText } = setup();
    fireEvent.click(getByTestId('edit-icon'));

    const nameInput = getByRole('textbox', { value: deviceMock.name });
    fireEvent.change(nameInput, { target: { value: '' } });

    const updateButton = getByText('Modificar');

    expect(updateButton).toBeDisabled();
  });

  it('does not render edit icon when showActions is false', () => {
    const { queryByTestId } = setup({ props: { ...defaultProps, showActions: false } });
    const editIcon = queryByTestId('edit-icon');

    expect(editIcon).toBeNull();
  }); 
});
