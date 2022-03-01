export type IGroupInterest = string;

export interface Users {
  [key: string]: IGroupMember;
}

export interface IGroupMember {
  name: string;
  admin: boolean;
}
