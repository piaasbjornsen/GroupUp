import {IFirebaseGroup, IFirebaseUser} from '../interfaces/firebase';

export const emptyGroupObject: IFirebaseGroup = {
  name: '',
  description: '',
  interests: [],
  members: [],
  groupAdmin: '',
  location: '',
  imageUrl: '',
  likes: [],
  matches: [],
  meetingDate: '',
};

export const emptyUserObject: IFirebaseUser = {
  name: '',
  email: '',
  dateOfBirth: '',
  admin: false,
  gold: false,
  groupsRated: [],
  reports: [],
};

export const availableLocations = ['Trondheim', 'Oslo', 'Bergen', 'Stavanger'];

export const defaultGroupImageUrl =
  'https://www.woosync.io/wp-content/uploads/2019/07/group.svg';
