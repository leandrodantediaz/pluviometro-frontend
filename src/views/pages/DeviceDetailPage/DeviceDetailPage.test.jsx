import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { useParams, useNavigate } from 'react-router-dom';
import { fireEvent, waitFor } from '@testing-library/react';
import { DeviceDetailPage } from './DeviceDetailPage';
import { render } from '../../../../testUtils/renderUtils'; 
import { getDeviceByIdMocks } from '../../../data/graphQL/mocks/queries/getDeviceById/getDeviceByIdMocks';
import { device1Mock } from '../../../data/graphQL/mocks/queries/getDevices/getDevicesMocks';
import UserService from '../../../data/services/UserService';

jest.mock('react-router-dom', () => { 
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../data/services/AuthService');
jest.mock('../../../data/services/UserService');

describe('DeviceDetailPage', () => {
  const setup = () =>
    render(
      <MockedProvider mocks={getDeviceByIdMocks} addTypename={false}>
        <DeviceDetailPage />
      </MockedProvider>
    );

  beforeEach(() => {
    useParams.mockReturnValue({ deviceId: '1' });
    useNavigate.mockReturnValue(jest.fn());
    UserService.getUser.mockReturnValue({ fullName: 'John Doe' });
  });

  it('renders the device details correctly', async () => {
    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText(device1Mock.name)).toBeInTheDocument();
      expect(getByText(device1Mock.serialNumber)).toBeInTheDocument();
      expect(getByText(`"lat": ${device1Mock.latitude}, "long": ${device1Mock.longitude}`)).toBeInTheDocument();
      expect(getByText('última actualización 27/5/2024')).toBeInTheDocument();
    });
  });

  it('navigates back when the back icon is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    const { getByTestId } = setup();

    const backIcon = getByTestId('arrow-left-icon'); 
    fireEvent.click(backIcon);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
