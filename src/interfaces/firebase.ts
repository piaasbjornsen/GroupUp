type IFirebaseGroupId = string;

export type IFirebaseUserId = string;
export type IFirebaseUserName = string;

type IFirebaseInterestId = string;

export interface IFirebaseGroup {
  name: string;
  description: string;
  interests: IFirebaseInterestId[];
  members: IFirebaseUserId[];
}

export type IFirebaseInterest = string;

export interface IFirebaseUser {
  name: IFirebaseUserName;
  admin: boolean;
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
