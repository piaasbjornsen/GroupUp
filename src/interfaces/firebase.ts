type IFirebaseGroupId = string;

export type IFirebaseUserId = string;
export type IFirebaseUserName = string;

type IFirebaseInterestId = string;

export interface IFirebaseGroup {
  name: string;
  description: string;
  interests: IFirebaseInterestId[];
  members: IFirebaseUserId[];
  groupAdmin: string;
  location: string;
  imageUrl: string;
  likes: IFirebaseLike[];
  matches: IFirebaseMatch[];
  rating?: IFirebaseRatingGroup;
  meetingDate: string;
  meetingFrequency: string;
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

export interface IFirebaseReport {
  reportedBy: string;
  reason: string;
}

export interface IFirebaseUser {
  name: IFirebaseUserName;
  email: string | null;
  admin: boolean;
  gold?: boolean;
  dateOfBirth: string;
  groupsRated?: IFirebaseRating[];
  reports?: IFirebaseReport[];
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
