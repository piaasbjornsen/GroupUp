import React from 'react';
import {render, screen} from '@testing-library/react';
import MyGroups from './MyGroups';
import {MemoryRouter} from 'react-router-dom';

test('renders group list', () => {
  render(
    <MemoryRouter>
      <MyGroups />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/Mine Grupper/i);
  expect(titleElement).toBeInTheDocument();
  const buttonElement = screen.getByText(/Opprett gruppe/i);
  expect(buttonElement).toBeInTheDocument();
});
