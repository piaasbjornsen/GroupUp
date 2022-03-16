import {IFirebaseUser} from '../interfaces/firebase';
export interface IErrorMessages {
  name: string;
  dateOfBirth: string;
  admin: string;
  gold: string;
}

export const emptyErrorMessages: IErrorMessages = {
  name: '',
  dateOfBirth: '',
  admin: '',
  gold: '',
};

export default (input: IFirebaseUser): IErrorMessages => {
  const errorMessages: IErrorMessages = {...emptyErrorMessages};

  if (input.name === '') {
    errorMessages.name = 'Du må oppgi et navn';
  }

  if (input.admin === null) {
    errorMessages.admin = 'Du må velge admin eller ikke';
  }
  if (input.gold === null) {
    errorMessages.gold = 'Du må velge gold eller ikke';
  }
  if (input.dateOfBirth === undefined) {
    errorMessages.dateOfBirth = 'Du må fylle inn fødselsdato';
  }
  return errorMessages;
};

export const userHasErrorMessages = (
  errorMessages: IErrorMessages
): boolean => {
  return JSON.stringify(errorMessages) !== JSON.stringify(emptyErrorMessages);
};
