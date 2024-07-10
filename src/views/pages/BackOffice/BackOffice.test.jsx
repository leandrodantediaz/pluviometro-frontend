import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BackOffice from './BackOffice';

jest.mock('../../components/MainHeader/MainHeader', () => {
  return {
    MainHeader: () => <div>Mocked MainHeader</div>
  };
});

jest.mock('../../components/BackOffice/BackOfficeViews/DevicesBackoffice', () => {
  return {
    DevicesBackoffice: () => <div>Mocked DevicesBackoffice</div>
  };
});

jest.mock('../../components/BackOffice/BackOfficeViews/UserBackOffice', () => {
  return {
    UserBackOffice: () => <div>Mocked UserBackOffice</div>
  };
});

jest.mock('../../components/BackOffice/BackOfficeViews/PlanBackOffice', () => {
  return {
    PlanBackOffice: () => <div>Mocked PlanBackOffice</div>
  };
});

jest.mock('../../components/BackOffice/ModalsBackOffice/ModalBackoffice', () => {
  return {
    ModalBackoffice: () => 
      <div>Mocked ModalBackoffice</div>
  };
});

describe('BackOffice Component', () => {
  test('renders correctly with initial state', () => {
    render(<BackOffice />);

    expect(screen.getByText('Mocked MainHeader')).toBeInTheDocument();

    expect(screen.getByText('Dispositivos')).toHaveClass('selected');

    expect(screen.getByText('Mocked DevicesBackoffice')).toBeInTheDocument();
  });

  test('switches to Usuarios section when Usuarios button is clicked', () => {
    render(<BackOffice />);

    fireEvent.click(screen.getByText('Usuarios'));

    expect(screen.getByText('Usuarios')).toHaveClass('selected');

    expect(screen.getByText('Mocked UserBackOffice')).toBeInTheDocument();
  });

  test('switches to Plan section when Plan button is clicked', () => {
    render(<BackOffice />);

    fireEvent.click(screen.getByText('Plan'));
  
    expect(screen.getByText('Plan')).toHaveClass('selected');

    expect(screen.getByText('Mocked PlanBackOffice')).toBeInTheDocument();
  });
});
