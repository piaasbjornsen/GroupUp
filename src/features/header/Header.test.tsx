import React from 'react';
import {render, screen} from '@testing-library/react';
import Header from './Header';

test('renders header components', () => {
  render(<Header />);
  const titleElement = screen.getByText(/GroupUp/i);
  expect(titleElement).toBeInTheDocument();
  const linkElement1 = screen.getByText(/Min side/i);
  expect(linkElement1).toBeInTheDocument();
  const linkElement2 = screen.getByText(/Finn grupper/i);
  expect(linkElement2).toBeInTheDocument();
  const linkElement3 = screen.getByText(/Logg ut/i);
  expect(linkElement3).toBeInTheDocument();
});
