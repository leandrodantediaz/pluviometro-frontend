import React, { useState } from 'react';
import { LogoIcon } from '../../../../icons';
import { useMediaQuery } from '@mui/material';
import { PasswordInput } from '../../../components/Inputs/PasswordInput';
import { useTheme } from '@emotion/react';
import { isPasswordValid } from '../../../../utils/validations/passwordValidator';
import { CHANGE_PASSWORD } from '../../../../data/graphQL/mutations/changePassword/changePassword';
import { useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import TokenService from '../../../../data/services/TokenService';
import toastService from '../../../../uiServices/ToastService';
import { LoadingButton } from '@mui/lab';
import '../recoverPasswordPage.scss';

export const RecoverPasswordModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const [ formData, setFormData ] = useState({
    password: '',
    repeatedPassword: '',
  });

  const [ validationErrors, setValidationErrors ] = useState({
    match: true,
    format: true,
  });

  const handleFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [ changePassword, { loading } ] = useMutation(CHANGE_PASSWORD, {
    variables: {
      password: formData.password,
    }
  });

  const token = searchParams.get('t');

  const handleRecoverPasswordSubmit = async (event) => {
    event.preventDefault();
    const passwordsMatch = formData.password === formData.repeatedPassword;
    setValidationErrors({
      match: passwordsMatch,
      format: isPasswordValid(formData.password)
    });

    if (!passwordsMatch || !isPasswordValid(formData.password)) return;

    try {
      TokenService.setToken(token);
      await changePassword();
      TokenService.clearToken();
      navigate('/login');
      toastService.showSuccess('Contraseña cambiada correctamente.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="recover-password-container" onSubmit={handleRecoverPasswordSubmit}>
      {!isMobile && <LogoIcon />}
      <div className="recover-password-title">Recuperar contraseña</div>
      <div className="items-container">
        <PasswordInput
          label="Contraseña"
          name="password"
          onPasswordChange={handleFormChange}
          error={!validationErrors.format || !validationErrors.match}
        />
        <PasswordInput
          inputId="repeatedPassword"
          label="Repetir contraseña"
          name="repeatedPassword"
          description="Debe ser una combinación de mínimo 6 caracteres, letras y números con al menos una mayúscula"
          onPasswordChange={handleFormChange}
          error={!validationErrors.format || !validationErrors.match}
        />
      </div>
      {!validationErrors.match && 
        <div className="credentials-invalid-message">Las contraseñas no coinciden.</div>}
      {validationErrors.match && !validationErrors.format && 
        <div className="credentials-invalid-message">Contraseña inválida.</div>}
      <LoadingButton
        variant="contained"
        type="submit"
        disabled={!formData.password.length || !formData.repeatedPassword.length}
        loading={loading}
        className="login-button"
      >
        Reestablecer
      </LoadingButton>
    </form>
  );
};
