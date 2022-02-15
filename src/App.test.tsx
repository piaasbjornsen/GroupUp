import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const buttonElement = screen.getByText(/LOGIN USING GOOGLE/i);
  expect(buttonElement).toBeInTheDocument();
});
