import {IUser} from './users';

export type IGroupInterest = string;

export interface Users {
  [key: string]: IGroupMember;
}

export interface IGroupMember {
  name: string;
  admin: boolean;
}

export interface IGroup {
  name: string;
  description?: string;
  interests?: IGroupInterest[];
  //PROBLEM
  //Ønsker egentlig kun IUser[], feilen skyldes problemet i creategroup/AddToList
  members?: (string | IUser)[];
  mathcRequests: IGroup[];
  matches: IGroup[];
}
