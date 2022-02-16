import React from 'react';
import {render, screen} from '@testing-library/react';
import MyGroups from './MyGroups';

test('renders group list', () => {
  render(<MyGroups />);
  const titleElement = screen.getByText(/Mine Grupper/i);
  expect(titleElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/Opprett gruppe/i);
  expect(buttonElement).toBeInTheDocument();
});
