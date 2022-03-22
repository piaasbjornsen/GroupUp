import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {
  IFirebaseGroup,
  IFirebaseGroups,
  IFirebaseInterests,
  IFirebaseUsers,
} from '../../interfaces/firebase';
import {RootState} from '../../redux/store';
import {groups as firebaseGroups} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import FilterView, {
  defaultFilterOptions,
  IFilterOptions,
  IMinMax,
} from './FilterView';
import GroupList, {IGroupListItem} from './GroupList';

export default function FindGroups() {
  const currentGroup = useSelector((state: RootState) => state.currentGroup);
  const [groups, setGroups] = useState<IGroupListItem[]>([]);
  const [filters, setFilters] = useState<IFilterOptions>(defaultFilterOptions);
  const [interests, setInterests] = useState<string[]>([]);
  const [minmax, setminmax] = useState<IMinMax>({
    age: [null, null],
    memberCount: [null, null],
  });

  useEffect(() => {
    firebaseUsers.once('value', userSnapshot => {
      const users: IFirebaseUsers = userSnapshot.val();
      firebaseGroups.once('value', snapshot => {
        const groups: IFirebaseGroups = snapshot.val();
        const groupArray = Object.entries(groups)
          .filter(
            (group: [string, IFirebaseGroup]) => group[0] !== currentGroup
          )
          .map((group: [string, IFirebaseGroup]) => {
            let minAge: number | null = null;
            let maxAge: number | null = null;
            group[1].members.forEach(memberId => {
              const partsString = users[memberId]?.dateOfBirth;
              let dt;
              if (partsString !== undefined) {
                const parts = partsString.split('-');
                dt = new Date(
                  parseInt(parts[0], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[2], 10)
                );
              } else {
                // User missing birth year
                return;
              }
              const ageDifMs = Date.now() - dt.getTime();
              const ageDate = new Date(ageDifMs); // miliseconds from epoch
              const age = Math.abs(ageDate.getUTCFullYear() - 1970);
              if (minAge === null || age < minAge) {
                minAge = age;
              }
              if (maxAge === null || age > maxAge) {
                maxAge = age;
              }
            });
            const updateMinmax = {...minmax};
            // Minmax age
            if (
              minAge !== null &&
              (minmax.age[0] === null || minmax.age[0] > minAge)
            ) {
              updateMinmax.age[0] = minAge;
              setminmax(updateMinmax);
            }
            if (
              maxAge !== null &&
              (minmax.age[1] === null || minmax.age[1] < maxAge)
            ) {
              updateMinmax.age[1] = maxAge;
              setminmax(updateMinmax);
            }
            // Minmax memberCount
            if (
              minmax.memberCount[0] === null ||
              minmax.memberCount[0] > group[1].members.length
            ) {
              updateMinmax.memberCount[0] = group[1].members.length;
              setminmax(updateMinmax);
            }
            if (
              minmax.memberCount[1] === null ||
              minmax.memberCount[1] < group[1].members.length
            ) {
              updateMinmax.memberCount[1] = group[1].members.length;
              setminmax(updateMinmax);
            }
            return {
              id: group[0],
              name: group[1].name,
              location: group[1].location,
              imageUrl: group[1].imageUrl,
              memberCount: group[1].members.length,
              interests: group[1].interests,
              description: group[1].description,
              minAge: minAge === null ? 0 : minAge,
              maxAge: maxAge === null ? 0 : maxAge,
            };
          });
        setGroups(groupArray);
      });
    });
    firebaseInterests.once('value', snapshot => {
      const interests: IFirebaseInterests = snapshot.val();
      setInterests(Object.values(interests));
    });
  }, []);

  return (
    <Grid
      container
      sx={{maxWidth: '80%', marginX: 'auto'}}
      justifyContent="center"
    >
      <Typography variant="h4" marginTop={5}>
        Finn grupper å matche med!
      </Typography>
      <FilterView
        filters={filters}
        setFilters={setFilters}
        minmax={minmax}
        interests={interests}
      />
      <GroupList
        groups={groups.filter(
          group =>
            (group.location === filters.location || filters.location === '') &&
            group.minAge >= filters.age[0] &&
            group.maxAge <= filters.age[1] &&
            group.memberCount >= filters.memberCount[0] &&
            group.memberCount <= filters.memberCount[1] &&
            group.interests.filter(
              interest =>
                filters.interests.includes(interest) ||
                filters.interests.length === 0
            ).length > 0
        )}
      />
    </Grid>
  );
}
