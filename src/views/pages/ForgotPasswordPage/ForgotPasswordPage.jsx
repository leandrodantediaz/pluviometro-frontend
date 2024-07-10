import React from 'react';
import { AuthContainer } from '../../components/AuthContainer/AuthContainer';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';

export const ForgotPasswordPage = () => (
  <AuthContainer>
    <ForgotPasswordModal />
  </AuthContainer>
);
