import React from 'react';
import {screen} from '@testing-library/react';
import MyGroups from './MyGroups';
import {MemoryRouter} from 'react-router-dom';
import {render} from '../../utils/test-utils';

test('renders group list', () => {
  render(
    <MemoryRouter>
      <MyGroups />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/Laster inn bruker/i);
  expect(titleElement).toBeInTheDocument();
});
