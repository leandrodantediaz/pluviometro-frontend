import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage/HomePage';
import { ErrorPage } from '../pages/ErrorPage';
import { StructurePage } from './baseStructure/StructurePage';
import moment from 'moment';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { RequireAuth } from '../../navigation/RequireAuth';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import { RecoverPasswordPage } from '../pages/RecoverPasswordPage/RecoverPasswordPage';
import { DeviceDetailPage } from '../pages/DeviceDetailPage/DeviceDetailPage';
import BackOffice from '../pages/BackOffice/BackOffice';
import { NotRequireAuth } from '../../navigation/NotRequireAuth';
import { InvitedUsersPage } from '../pages/InvitedUsersPage/InvitedUsersPage';

export const RootPage = () => {
  moment.locale('es');

  const defaultRouteConfig = {
    errorElement: <ErrorPage />,
  };

  const authRoutes = [
    {
      path: '/',
      element: <HomePage />,
      requireAuth: true,
      roleRequired: [ 2, 3, 4 ]
    },
    {
      path: '/device/:deviceId',
      element: <DeviceDetailPage />,
      requireAuth: true,
      roleRequired: [ 2, 3, 4 ]
    },
    {
      path: '/invited-users',
      element: <InvitedUsersPage />,
      requireAuth: true,
      roleRequired: [ 2, 3 ]
    }
  ];

  const backOfficeRoutes = [
    {
      path: '/backoffice',
      element: <BackOffice />,
      requireAuth: true,
      roleRequired: [ 1 ]
    },
  ];

  const nonAuthRoutes = [
    {
      path: '/login',
      element: <LoginPage />,
      requireAuth: false,
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage />,
      requireAuth: false,
    },
    {
      path: '/recover-password',
      element: <RecoverPasswordPage />,
      requireAuth: false,
    },
  ];

  const routes = [
    ...backOfficeRoutes,
    ...authRoutes,
    ...nonAuthRoutes
  ];

  const elementForRoute = ( route ) => {
    if ( route.requireAuth ) {
      return (
        <RequireAuth roleRequired={route.roleRequired}>
          {route.element}
        </RequireAuth>
      );
    }

    return (
      <NotRequireAuth>
        {route.element}
      </NotRequireAuth>
    );
  };
  
  const getRouteProps = ( route ) => { 
    return {
      path: route.path,
      element: elementForRoute( route ),
    }; 
  };

  const router = createBrowserRouter([
    {
      ...defaultRouteConfig,
      element: <StructurePage />,
      children: routes.map( getRouteProps ),
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};
