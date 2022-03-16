import React from 'react';
import {screen} from '@testing-library/react';
import App from './App';
import {render} from './utils/test-utils';

test('renders login page', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Laster inn/i);
  expect(loadingElement).toBeInTheDocument();
});
