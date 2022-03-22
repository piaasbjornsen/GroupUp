import React from 'react';
import {screen} from '@testing-library/react';
import Header from './Header';
import {MemoryRouter} from 'react-router-dom';
import {render} from '../../utils/test-utils';

test('renders header components', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/FINN GRUPPER/i);
  expect(titleElement).toBeInTheDocument();
  const linkElement1 = screen.getByText(/OPPRETT GRUPPE/i);
  expect(linkElement1).toBeInTheDocument();
  const linkElement3 = screen.getByText(/VELG GRUPPE/i);
  expect(linkElement3).toBeInTheDocument();
});
