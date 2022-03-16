import React from 'react';
import {render, screen} from '@testing-library/react';
import Login from './Login';
import {MemoryRouter} from 'react-router-dom';

test('renders groupup and login button', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/GroupUp/i);
  expect(titleElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/LOGIN USING GOOGLE/i);
  expect(buttonElement).toBeInTheDocument();
});
