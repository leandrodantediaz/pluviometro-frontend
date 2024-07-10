import React from 'react';
import { fireEvent, render } from '../../../../testUtils/renderUtils';
import { MainHeader } from './MainHeader';
import UserService from '../../../data/services/UserService';
import AuthService from '../../../data/services/AuthService';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('../../../data/services/AuthService');
jest.mock('../../../data/services/UserService');

describe('MainHeader', () => {
  const setup = () => render(
    <MockedProvider>
      <MainHeader />
    </MockedProvider>
  );
  
  beforeEach(() => {
    UserService.getUser.mockReturnValue({ fullName: 'John Doe' });
  });

  it('renders MainHeader correctly', () => {
    const { getByText } = setup();

    expect(getByText('Mapa de dispositivos')).toBeInTheDocument();
    expect(getByText('Usuarios Invitados')).toBeInTheDocument();
  });

  it('navigates to home page when home button is clicked', () => {
    const { getByText } = setup();
    const homeButton = getByText('Mapa de dispositivos');
    homeButton.click();

    expect(window.location.pathname).toBe('/');
  });

  it('renders user initials in avatar', () => {
    UserService.getUser.mockReturnValueOnce({ fullName: 'John Doe' });
    const { getByText } = setup();
    expect(getByText('JD')).toBeInTheDocument();
  });

  it('opens menu on click', () => {
    const { getByText } = setup();
    const avatarButton = getByText('JD');

    fireEvent.click(avatarButton);

    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('closes menu on menu item click', () => {
    const { getByText } = setup();
    const avatarButton = getByText('JD');

    fireEvent.click(avatarButton);
    const logoutMenuItem = getByText('Logout');
    fireEvent.click(logoutMenuItem);

    expect(AuthService.logout).toHaveBeenCalledTimes(1);
  });
});
