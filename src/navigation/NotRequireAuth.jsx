import { Navigate } from 'react-router-dom';
import React from 'react';
import AuthService from '../data/services/AuthService';

export const NotRequireAuth = ({ children }) => (
  AuthService.isAuthenticated()
    ? <Navigate to="/" />
    : <>{children}</>
);
