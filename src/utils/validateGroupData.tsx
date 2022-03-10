import {IFirebaseGroup} from '../interfaces/firebase';

export interface IErrorMessages {
  name: string;
  description: string;
  members: string;
  interests: string;
}

export const emptyErrorMessages = {
  name: '',
  description: '',
  members: '',
  interests: '',
};

export default (input: IFirebaseGroup): IErrorMessages => {
  const errorMessages: IErrorMessages = {...emptyErrorMessages};
  if (input.name === '') {
    errorMessages.name = 'Du må gi gruppen et navn';
  }
  if (input.description === '') {
    errorMessages.description = 'Du må gi gruppen en beskrivelse';
  }
  if (input.interests.length === 0) {
    errorMessages.interests = 'Gruppen må ha interesser';
  }
  return errorMessages;
};

export const groupHasErrorMessages = (
  errorMessages: IErrorMessages
): boolean => {
  return JSON.stringify(errorMessages) !== JSON.stringify(emptyErrorMessages);
};
