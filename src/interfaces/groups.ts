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
  members?: (string | IGroupMember)[];
  mathcRequests: IGroup[];
  matches: IGroup[];
}
