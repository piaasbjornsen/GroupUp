import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IFirebaseGroup} from '../interfaces/firebase';
import type {RootState} from './store';

// Define a type for the slice state
export interface ICurrentGroupState {
  groupId?: string;
  group?: IFirebaseGroup;
}

// Define the initial state using that type
let initialState: ICurrentGroupState = {};

if (sessionStorage.getItem('currentGroup') !== null) {
  initialState = JSON.parse(sessionStorage.getItem('currentGroup') ?? '');
}

export const currentGroupSlice = createSlice({
  name: 'currentGroup',
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<ICurrentGroupState>) => {
      sessionStorage.setItem('currentGroup', JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const {setCurrentGroup} = currentGroupSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const currentGroup = (state: RootState) => state.currentGroup;

export default currentGroupSlice.reducer;
