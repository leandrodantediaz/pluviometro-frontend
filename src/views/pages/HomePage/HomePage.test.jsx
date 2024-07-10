import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { HomePage } from './HomePage';
import { render, fireEvent, waitFor } from '../../../../testUtils/renderUtils';
import { device1Mock, device2Mock, getDevicesMocks } from '../../../data/graphQL/mocks/queries/getDevices/getDevicesMocks';
import UserService from '../../../data/services/UserService';
import useCenterMap from './hooks/useCenterMap';

jest.mock('../../../data/services/AuthService');
jest.mock('../../../data/services/UserService');
jest.mock('./hooks/useCenterMap');

describe('HomePage', () => {
  const setup = () =>
    render(
      <MockedProvider mocks={getDevicesMocks} addTypename={false}>
        <HomePage />
      </MockedProvider>
    );
  
  beforeEach(() => {
    UserService.getUser.mockReturnValue({ fullName: 'John Doe' });
    useCenterMap.mockReturnValue({
      loadingMap: false,
      handleCenterMap: jest.fn(),
    });
  });

  it('renders the home page correctly', async () => {
    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText(device1Mock.name)).toBeInTheDocument();
      expect(getByText(device2Mock.name)).toBeInTheDocument();
    });
  });

  it('opens device detail when device button is clicked', async () => {
    const { getByText, getAllByText, queryByTestId, getByRole } = setup();
    
    await waitFor(() => {
      const deviceButton = getByText(device1Mock.name);
      fireEvent.click(deviceButton);
    });
  
    await waitFor(() => {
      expect(getAllByText(device1Mock.name).length).toBe(2);
      expect(getByText(device1Mock.serialNumber)).toBeInTheDocument();
      expect(getByText(`"lat": ${device1Mock.latitude}, "long": ${device1Mock.longitude}`)).toBeInTheDocument();
      expect(getByText('última actualización 27/5/2024')).toBeInTheDocument();
      expect(queryByTestId('edit-icon')).toBeNull();
      expect(getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
      expect(getByRole('button', { name: 'Ver detalle' })).toBeInTheDocument();
    });
  });

  it('navigates to device detail when "Ver detalle" button is clicked', async () => {
    const { getByText, getByRole } = setup();
    
    await waitFor(() => {
      const deviceButton = getByText(device2Mock.name);
      fireEvent.click(deviceButton);
    });

    await waitFor(() => {
      const viewDetailButton = getByRole('button', { name: 'Ver detalle' });
      fireEvent.click(viewDetailButton);
    });

    expect(window.location.pathname).toBe('/device/2');
  });

  it('closes device detail when closed button is clicked', async () => {
    const { getByText, getByRole, getAllByText } = setup();
    
    await waitFor(() => {
      const deviceButton = getByText(device2Mock.name);
      fireEvent.click(deviceButton);
    });
    
    await waitFor(() => {
      const viewDetailButton = getByRole('button', { name: 'Cerrar' });
      fireEvent.click(viewDetailButton);
    });
    
    await waitFor(() => {
      expect(getAllByText(device1Mock.name).length).toBe(1);
    });
  });
});
