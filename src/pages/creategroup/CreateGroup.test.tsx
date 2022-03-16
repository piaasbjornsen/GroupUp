import React from 'react';
import {screen} from '@testing-library/react';
import CreateGroup from './CreateGroup';
import {MemoryRouter} from 'react-router-dom';
import {render} from '../../utils/test-utils';

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
    'Inviter medlemmer',
    'Legg til interesser',
  ];
  expectedTexts.forEach(text => {
    const elements = screen.getAllByText(new RegExp(text, 'i'));
    elements.forEach(element => expect(element).toBeInTheDocument());
  });
});
