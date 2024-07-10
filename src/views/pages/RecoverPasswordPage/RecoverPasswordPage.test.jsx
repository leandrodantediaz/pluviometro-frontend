import React from 'react';
import { fireEvent, render, waitFor } from '../../../../testUtils/renderUtils';
import { screen } from '@testing-library/react';
import { RecoverPasswordPage } from './RecoverPasswordPage';
import { MockedProvider } from '@apollo/client/testing';
import { changePasswordMocks } from '../../../data/graphQL/mocks/mutations/changePassword/changePasswordMocks';
import toastService from '../../../uiServices/ToastService';

const mockedUsedNavigate = jest.fn();
jest.mock( 'react-router-dom', () => {
  return {
    ...jest.requireActual( 'react-router-dom' ),
    useNavigate: () => mockedUsedNavigate
  }; 
} );
const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

describe('RecoverPasswordPage', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={changePasswordMocks} addTypename={false}>  
        <RecoverPasswordPage />
      </MockedProvider>
    );
  });

  it('renders correctly with essential elements', () => {
    const recoverPasswordTitle = screen.getByText('Recuperar contraseña');
    const passwordInput = screen.getByLabelText('Contraseña');
    const repeatedPasswordInput = screen.getByLabelText('Repetir contraseña');
    const submitButton = screen.getByText('Reestablecer');

    expect(recoverPasswordTitle).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(repeatedPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  const fillCredentials = (password, repeatedPassword) => {
    const passwordInput = screen.getByLabelText('Contraseña');
    const repeatedPasswordInput = screen.getByLabelText('Repetir contraseña');
  
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(repeatedPasswordInput, { target: { value: repeatedPassword } });
  };

  describe('Password inputs functionality', () => {
    const loginWithCredentials = (password, repeatedPassword) => {
      const submitButton = screen.getByText('Reestablecer');
    
      fillCredentials(password, repeatedPassword);
      fireEvent.click(submitButton);
    };

    it('shows error message when passwords do not match', async () => {
      loginWithCredentials('password123', 'password321');

      await waitFor(() => {
        const errorMessage = screen.getByText('Las contraseñas no coinciden.');
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('shows error message when password is invalid', async () => {
      loginWithCredentials('invalidpassword', 'invalidpassword');

      await waitFor(() => {
        const errorMessage = screen.getByText('Contraseña inválida.');
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('does not show error message when passwords match and are valid', async () => {
      loginWithCredentials('Password123', 'Password123');

      await waitFor(() => {
        const errorMessage = screen.queryByText('Las constraseñas no coinciden.');
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
  });

  describe('Login Button functionality', () => {
    it('disables submit button when inputs are empty', async () => {
      const submitButton = screen.getByText('Reestablecer');

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('enables submit button when inputs are filled', async () => {
      const submitButton = screen.getByText('Reestablecer');
      fillCredentials('Password123', 'Password123');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('triggers reset password process correctly', async () => {
      const submitButton = screen.getByText('Reestablecer');
      fillCredentials('Password123', 'Password123');
      fireEvent.click(submitButton);
     
      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
        expect(showSuccessSpy).toHaveBeenCalledWith('Contraseña cambiada correctamente.');
      });
    });
  });
});
