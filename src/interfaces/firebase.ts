type IFirebaseGroupId = string;
type IFirebaseUserId = string;
type IFirebaseInterestId = string;

export interface IFirebaseGroup {
  name: string;
  description: string;
  interests: IFirebaseInterestId[];
  members: IFirebaseUserId[];
}

export type IFirebaseInterest = string;

export interface IFirebaseUser {
  name: string;
  admin: boolean;
}

export interface IFirebaseDb {
  groups: {
    [key: IFirebaseGroupId]: IFirebaseGroup;
  };
  interests: {
    [key: IFirebaseInterestId]: IFirebaseInterest;
  };
  users: {
    [key: IFirebaseUserId]: IFirebaseUser;
  };
}
