import React from 'react';
import { render } from '@testing-library/react';
import ModalBackoffice from './ModalBackoffice';

describe('ModalBackoffice', () => {
  it('renders ModalDevicesBackoffice correctly', () => {
    const { getByText } = render(
      <ModalBackoffice section="Dispositivos" refetchDevicesTable={() => {}} />
    );
    expect(getByText('Modal de Dispositivos')).toBeInTheDocument();
  });

  it('renders ModalUserBackoffice correctly', () => {
    const { getByText } = render(
      <ModalBackoffice section="Usuarios" refetchUsersTable={() => {}} />
    );
    expect(getByText('Modal de Usuarios')).toBeInTheDocument();
  });

  it('renders ModalPlansBackoffice correctly', () => {
    const { getByText } = render(
      <ModalBackoffice section="Plan" refetchPlansTable={() => {}} />
    );
    expect(getByText('Modal de Planes')).toBeInTheDocument();
  });

  it('renders null for unknown section', () => {
    const { container } = render(
      <ModalBackoffice section="Otros" refetchUsersTable={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
