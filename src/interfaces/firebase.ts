type IFirebaseGroupId = string;

export type IFirebaseUserId = string;
export type IFirebaseUserName = string;

type IFirebaseInterestId = string;

export interface IFirebaseGroup {
  name: string;
  description: string;
  interests: IFirebaseInterestId[];
  members: IFirebaseUserId[];
  location: string;
  imageUrl: string;
  likes: IFirebaseLike[];
  matches: IFirebaseMatch[];
  rating?: IFirebaseRatingGroup;
}

export interface IFirebaseLike {
  id: IFirebaseGroupId;
  super: boolean;
}

export interface IFirebaseMatch {
  id: IFirebaseGroupId;
  date: string;
}

export type IFirebaseInterest = string;

export interface IFirebaseRating {
  groupRated: string;
  rating: number;
}

export interface IFirebaseRatingGroup {
  score: number;
  count: number;
}

export interface IFirebaseUser {
  name: IFirebaseUserName;
  admin: boolean;
  gold?: boolean;
  groupsRated?: IFirebaseRating[];
}

export interface IFirebaseGroups {
  [key: IFirebaseGroupId]: IFirebaseGroup;
}

export interface IFirebaseInterests {
  [key: IFirebaseInterestId]: IFirebaseInterest;
}

export interface IFirebaseUsers {
  [key: IFirebaseUserId]: IFirebaseUser;
}

export interface IFirebaseDb {
  groups: IFirebaseGroups;
  interests: IFirebaseInterests;
  users: IFirebaseUsers;
}
