import React from 'react';
import {render, screen} from '@testing-library/react';
import CreateGroup from './CreateGroup';
import {MemoryRouter} from 'react-router-dom';

test('renders main create group components', () => {
  render(
    <MemoryRouter>
      <CreateGroup />
    </MemoryRouter>
  );
  const expectedTexts = [
    'Opprett gruppe',
    'Gruppenavn',
    'Beskrivelse',
    'Legg til medlemmer',
    'Legg til interesser',
  ];
  expectedTexts.forEach(text => {
    const elements = screen.getAllByText(new RegExp(text, 'i'));
    elements.forEach(element => expect(element).toBeInTheDocument());
  });
});
