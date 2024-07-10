import React from 'react';
import { fireEvent, render, waitFor } from '../../../../testUtils/renderUtils';
import { screen } from '@testing-library/react';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { MockedProvider } from '@apollo/client/testing';
import { sendMailChangePasswordMocks } from '../../../data/graphQL/mocks/mutations/sendMailChangePassword/sendMailChangePasswordMocks';
import toastService from '../../../uiServices/ToastService';

const showSuccessSpy = jest.spyOn(toastService, 'showSuccess');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={sendMailChangePasswordMocks} addTypename={false}>  
        <ForgotPasswordPage />
      </MockedProvider>
    );
  });

  it('renders correctly with essential elements', () => {
    const recoverPasswordTitle = screen.getByText('Recuperar contraseña');
    const emailInput = screen.getByLabelText('Email');
    const sendRecoveryEmailButton = screen.getByText('Enviar email de recuperación');
    const goBackToLoginButton = screen.getByText('volver al Login');

    expect(recoverPasswordTitle).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(sendRecoveryEmailButton).toBeInTheDocument();
    expect(goBackToLoginButton).toBeInTheDocument();
  });

  const fillEmail = (email) => {
    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(emailInput, { target: { value: email } });
  };

  describe('Email Input functionality', () => {
    const sendRecoveryEmail = (email) => {
      const sendRecoveryEmailButton = screen.getByText('Enviar email de recuperación');

      fillEmail(email);
      fireEvent.click(sendRecoveryEmailButton);
    };

    it('displays email validation message correctly', async () => {
      sendRecoveryEmail('invalidemail.com');

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });

    it('does not display invalid message if email is valid', async () => {
      sendRecoveryEmail('valid@mail.com');

      await waitFor(() => {
        expect(screen.queryByText('Email inválido')).toBeNull();
      });
    });
  });

  describe('Recover Button functionality', () => {
    it('is disabled when email field is empty', () => {
      const sendRecoveryEmailButton = screen.getByText('Enviar email de recuperación');
    
      expect(sendRecoveryEmailButton).toBeDisabled();
    });

    it('is enabled when email and password fields are filled', () => {
      const sendRecoveryEmailButton = screen.getByText('Enviar email de recuperación');
      fillEmail('validemail@example.com');

      expect(sendRecoveryEmailButton).toBeEnabled();
    });

    it('triggers recover process correctly', async () => {
      const sendRecoveryEmailButton = screen.getByText('Enviar email de recuperación');
      fillEmail('validemail@example.com');
      fireEvent.click(sendRecoveryEmailButton);

      await waitFor(() => {
        expect(showSuccessSpy).toHaveBeenCalledWith('Correo electrónico enviado exitosamente');
      });
    });
  });
});
