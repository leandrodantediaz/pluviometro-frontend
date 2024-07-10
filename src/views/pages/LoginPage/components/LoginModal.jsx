import React, { useState } from 'react';
import { LogoIcon } from '../../../../icons';
import { useMediaQuery } from '@mui/material';
import { EmailInput } from '../../../components/Inputs/EmailInput';
import { PasswordInput } from '../../../components/Inputs/PasswordInput';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { isEmailValid } from '../../../../utils/validations/emailValidator';
import { AUTHENTICATE_USER } from '../../../../data/graphQL/mutations/authenticateUser/authenticateUser';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import AuthService from '../../../../data/services/AuthService';
import '../loginPage.scss';

export const LoginModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
  });
  const [ validEmail, setValidEmail ] = useState(true);
  const navigate = useNavigate();

  const [ authenticateUser, { loading } ] = useMutation(AUTHENTICATE_USER, {
    variables: {
      email: formData.email,
      password: formData.password,
    }
  });

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const isValidEmail = isEmailValid(formData.email);
    setValidEmail(isValidEmail);
    if (!isValidEmail) return;

    try {
      const { data } = await authenticateUser();
      const { token, user } = data.authenticateUser;
      AuthService.login(token, user);
      const isSuperAdmin = user?.rolId === 1;
      isSuperAdmin ? navigate('/backoffice') : navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className="login-container" onSubmit={handleLoginSubmit}>
      {!isMobile && <LogoIcon />}
      <div className="login-title">Acceder</div>
      <div className="items-container">
        <EmailInput
          label="Email"
          onEmailChange={handleLoginFormChange}
        />
        <PasswordInput
          label="Contraseña"
          onPasswordChange={handleLoginFormChange}
        />
      </div>
      {!validEmail && <div className="credentials-invalid-message">Email inválido</div>}
      <div
        className="forgot-password"
        onClick={() => navigate('/forgot-password')}
      >
        ¿Olvidaste la contraseña?
      </div>
      <LoadingButton
        variant="contained"
        type="submit"
        disabled={!formData.email.length || !formData.password.length}
        className="login-button"
        loading={loading}
      >
        Ingresar
      </LoadingButton>
    </form>
  );
};
