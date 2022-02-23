import React from 'react';
import {render, screen} from '@testing-library/react';
import CreateGroup from './CreateGroup';

test('renders main create group components', () => {
  render(<CreateGroup />);
  const expectedTexts = [
    'Opprett gruppe',
    'Gruppenavn',
    'Beskrivelse',
    'Legg til brukere',
    'Legg til interesser',
  ];
  expectedTexts.forEach(text => {
    const elements = screen.getAllByText(new RegExp(text, 'i'));
    elements.forEach(element => expect(element).toBeInTheDocument());
  });
});
