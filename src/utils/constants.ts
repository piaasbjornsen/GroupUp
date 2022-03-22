import {IFirebaseGroup, IFirebaseUser} from '../interfaces/firebase';

export const emptyGroupObject: IFirebaseGroup = {
  name: '',
  description: '',
  interests: [],
  members: [],
  location: '',
  imageUrl: '',
  likes: [],
  matches: [],
};

export const emptyUserObject: IFirebaseUser = {
  name: '',
  admin: false,
  gold: false,
};

export const availableLocations = ['Trondheim', 'Oslo', 'Bergen', 'Stavanger'];

export const defaultGroupImageUrl =
  'https://www.woosync.io/wp-content/uploads/2019/07/group.svg';
