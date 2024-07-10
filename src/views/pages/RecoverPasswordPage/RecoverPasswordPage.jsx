import React from 'react';
import { AuthContainer } from '../../components/AuthContainer/AuthContainer';
import { RecoverPasswordModal } from './components/RecoverPasswordModal';

export const RecoverPasswordPage = () => (
  <AuthContainer>
    <RecoverPasswordModal />
  </AuthContainer>
);
