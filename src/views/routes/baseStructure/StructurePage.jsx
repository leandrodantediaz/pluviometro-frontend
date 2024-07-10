import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

export const StructurePage = () => (
  <>
    <Outlet />
    <ScrollRestoration />
  </>
);
