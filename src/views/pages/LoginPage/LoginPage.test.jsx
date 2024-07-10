import React from 'react';
import { fireEvent, render, waitFor } from '../../../../testUtils/renderUtils';
import { screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { MockedProvider } from '@apollo/client/testing';
import { authenticateUserMocks } from '../../../data/graphQL/mocks/mutations/authenticateUser/authenticateUserMocks';

const mockedUsedNavigate = jest.fn();
jest.mock( 'react-router-dom', () => {
  return {
    ...jest.requireActual( 'react-router-dom' ),
    useNavigate: () => mockedUsedNavigate
  }; 
} );

describe('LoginPage', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={authenticateUserMocks} addTypename={false}>  
        <LoginPage />
      </MockedProvider>
    );
  });

  it('renders correctly with essential elements', () => {
    const loginTitle = screen.getByText('Acceder');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const forgotPasswordButton = screen.getByText('¿Olvidaste la contraseña?');

    expect(loginTitle).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(forgotPasswordButton).toBeInTheDocument();
  });

  const fillCredentials = (email, password) => {
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
  
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
  };

  describe('Email and Password Input functionality', () => {
    const loginWithCredentials = (email, password) => {
      const loginButton = screen.getByText('Ingresar');
    
      fillCredentials(email, password);
      fireEvent.click(loginButton);
    };


    it('displays email validation message correctly', async () => {
      loginWithCredentials('invalidemail.com', 'Validpassword123');
    
      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });

    it('does not display invalid messages if credentials are valid', async () => {
      loginWithCredentials('validemail@example.com', 'Validpassword123');
    
      await waitFor(() => {
        expect(screen.queryByText('Email inválido')).toBeNull();
        expect(screen.queryByText('Contraseña inválida')).toBeNull();
      });
    });
  });

  describe('Login Button functionality', () => {
    it('is disabled when email and password fields are empty', () => {
      const loginButton = screen.getByText('Ingresar');
    
      expect(loginButton).toBeDisabled();
    });

    it('is enabled when email and password fields are filled', () => {
      const loginButton = screen.getByText('Ingresar');
      fillCredentials('validemail@example.com', 'Validpassword123');

      expect(loginButton).toBeEnabled();
    });

    it('triggers login process correctly', async () => {
      const loginButton = screen.getByText('Ingresar');

      fillCredentials('validemail@example.com', 'Validpassword123');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('displays error message on invalid login attempt', async () => {
      fillCredentials('invalidemail@example.com', 'invalidpassword');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loginButton = screen.getByText('Ingresar');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          new Error('Email desconocido o contraseña incorrecta, por favor vuelva a intentarlo.')
        );
        expect(mockedUsedNavigate).not.toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Forgot Password functionality', () => {
    it('navigates to forgot password page', () => {
      const forgotPasswordButton = screen.getByText('¿Olvidaste la contraseña?');

      fireEvent.click( forgotPasswordButton );
      expect( mockedUsedNavigate ).toHaveBeenCalledWith('/forgot-password');
    });
  });
});
