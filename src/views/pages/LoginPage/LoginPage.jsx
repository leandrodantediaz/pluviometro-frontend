import React from 'react';
import { AuthContainer } from '../../components/AuthContainer/AuthContainer';
import { LoginModal } from './components/LoginModal';

export const LoginPage = () => (
  <AuthContainer>
    <LoginModal />
  </AuthContainer>
);
