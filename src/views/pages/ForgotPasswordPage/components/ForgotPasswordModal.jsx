import React, { useState } from 'react';
import { LogoIcon } from '../../../../icons';
import { useMediaQuery } from '@mui/material';
import { EmailInput } from '../../../components/Inputs/EmailInput';
import { useTheme } from '@emotion/react';
import { isEmailValid } from '../../../../utils/validations/emailValidator';
import { useMutation } from '@apollo/client';
import { SEND_MAIL_CHANGE_PASSWORD } from '../../../../data/graphQL/mutations/sendMailChangePassword/sendMailChangePassword';
import { LoadingButton } from '@mui/lab';
import toastService from '../../../../uiServices/ToastService';
import { useNavigate } from 'react-router-dom';
import '../forgotPasswordPage.scss';

export const ForgotPasswordModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();

  const [ email, setEmail ] = useState('');
  const [ validEmail, setValidEmail ] = useState(true);

  const handleEmailChange = (name, value) => {
    setEmail(value);
  };

  const [ sendMailChangePassword, { loading } ] = useMutation(SEND_MAIL_CHANGE_PASSWORD, {
    variables: {
      toEmail: email,
    }
  });

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setValidEmail(isEmailValid(email));

    if (!isEmailValid(email)) return;

    try {
      const { data } = await sendMailChangePassword();
      toastService.showSuccess(data.sendMailChangePassword);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="forgot-password-container" onSubmit={handleForgotPasswordSubmit}>
      {!isMobile && <LogoIcon />}
      <div className="forgot-password-title">Recuperar contraseña</div>
      <EmailInput
        label="Email"
        error={!validEmail}
        onEmailChange={handleEmailChange}
      />
      {!validEmail && 
        <div className="email-invalid-message">Email inválido</div>}
      <div className="buttons-container">
        <LoadingButton
          variant="contained"
          type="submit"
          disabled={!email.length}
          loading={loading}
          className="forgot-password-button"
        >
          Enviar email de recuperación
        </LoadingButton>
        <div className="back-to-login-button" onClick={() => navigate('/login')}>volver al Login</div>
      </div>
    </form>
  );
};
