import { Navigate } from 'react-router-dom';
import React from 'react';
import AuthService from '../data/services/AuthService';
import UserService from '../data/services/UserService';

export const RequireAuth = ({ roleRequired, children }) => {
  const currentUser = UserService.getUser();
  const userIsAuthenticated = AuthService.isAuthenticated();
  const userHasPermission = roleRequired.includes(currentUser?.rolId);
  const fallbackRoute = currentUser?.rolId === 1 ? '/backoffice' : '/';
  
  return (
    userIsAuthenticated && userHasPermission
      ? <>{children}</>
      : <Navigate to={!userIsAuthenticated ? '/login' : fallbackRoute} />
  ); };
