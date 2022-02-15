import React from 'react';
import {render, screen} from '@testing-library/react';
import Login from './Login';

test('renders groupup and login button', () => {
  render(<Login />);
  const titleElement = screen.getByText(/GroupUp/i);
  expect(titleElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/LOGIN USING GOOGLE/i);
  expect(buttonElement).toBeInTheDocument();
});
