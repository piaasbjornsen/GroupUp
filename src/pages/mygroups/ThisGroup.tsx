import {
  Grid,
  Button,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import GroupsIcon from '@mui/icons-material/Groups';
import {
  IFirebaseDb,
  IFirebaseGroup,
  IFirebaseInterest,
  IFirebaseMatch,
  IFirebaseLike,
  IFirebaseUserId,
  IFirebaseUserName,
  IFirebaseGroups,
} from '../../interfaces/firebase';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import validateGroupData, {
  emptyErrorMessages,
  groupHasErrorMessages,
  IErrorMessages,
} from '../../utils/validateGroupData';
import {ContainedAlert} from '../../features/containedalert/ContainedAlert';
import {
  availableLocations,
  defaultGroupImageUrl,
  emptyGroupObject,
} from '../../utils/constants';

//Bruker i liste
interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

interface IMatchListItem extends IFirebaseGroup, IFirebaseMatch {}
interface ILikeListItem {
  id: string;
  group: IFirebaseGroup;
}

const AddToList: React.FC = () => {
  const currentUser = useContext(AuthContext);
  const [input, setInput] = useState<IFirebaseGroup>(emptyGroupObject);
  const [interests, setInterests] = useState<IFirebaseInterest[]>([]);
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [resetForm, setResetForm] = useState(false);
  const [matchedGroups, setMatchedGroups] = useState<IMatchListItem[]>([]);
  const [superLikesGroups, setSuperLikesGroups] = useState<ILikeListItem[]>([]);
  const [likesGroups, setlikesGroups] = useState<ILikeListItem[]>([]);
  const [errorMessages, setErrorMessages] =
    useState<IErrorMessages>(emptyErrorMessages);
  const [updateSucceeded, setUpdateSucceeded] = useState(false);
  const [invalidGroupId, setInvalidGroupId] = useState(false);
  const [group, setGroup] = useState<IFirebaseGroup>(emptyGroupObject);
  const urlParams = useParams();
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const groupID = urlParams.groupId ? urlParams.groupId : '';
  const [groups, setGroups] = useState<IFirebaseDb['groups']>();
  const [gold, setGold] = useState<boolean>(false);

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroups(groups);
      const thisGroup = groups[urlParams.groupId ?? ''];
      if (groups[urlParams.groupId ?? ''] ?? false) {
        setGroup(thisGroup);
        setInput(thisGroup);

        const matchList: IMatchListItem[] = (
          thisGroup.matches ?? []
        ).map<IMatchListItem>(match => ({
          ...groups[match.id],
          ...match,
        }));

        setMatchedGroups(matchList); //Må lage objekter av ID fra matched group

        firebaseUsers.once('value', snapshot => {
          const users: IFirebaseDb['users'] = snapshot.val();
          const userList: IUserListItem[] = Object.keys(
            users
          ).map<IUserListItem>(userId => ({
            id: userId,
            name: users[userId].name,
          }));
          setUsers(userList);
          setResetForm(!resetForm);
        });
      } else {
        console.log('Invalid group-id');
        setInvalidGroupId(true);
      }
    });
    firebaseInterests.once('value', snapshot => {
      const interests = snapshot.val();
      setInterests(interests);
    });

    //Group
    firebaseGroups.child(groupID).once('value', snapshot => {
      const group = snapshot.val();
      if (typeof group.likes === 'undefined') {
        group.likes = [];
      }
      if (typeof group.matches === 'undefined') {
        group.matches = [];
      }
      firebaseGroups.once('value', snapshot => {
        const groups: IFirebaseGroups = snapshot.val();
        const superLikesID: string[] = group.likes
          .filter((like: IFirebaseLike) => like.super)
          .map((like: IFirebaseLike) => like.id);
        const superLikesList: ILikeListItem[] = group.likes
          .filter((like: IFirebaseLike) => like.super && like.id !== '')
          .map((like: IFirebaseLike) => {
            return {id: like.id, group: groups[like.id]};
          });
        setSuperLikesGroups(superLikesList);
        const likesList: ILikeListItem[] = group.likes
          .filter(
            (like: IFirebaseLike) =>
              !like.super && !superLikesID.includes(like.id) && like.id !== ''
          )
          .map((like: IFirebaseLike) => {
            return {id: like.id, group: groups[like.id]};
          });
        setlikesGroups(likesList);
        firebaseUsers.once('value', snapshot => {
          const users: IFirebaseDb['users'] = snapshot.val();
          setGold(
            group.members.some((user: string) => users[user].gold ?? false)
          );
        });
      });
    });
  }, []);

  if (invalidGroupId) {
    return <ContainedAlert severity="error" message="Ugyldig gruppe id" />;
  }

  if (group === null || users === null || interests === null) {
    return <ContainedAlert severity="info" message="Laster inn..." />;
  }

  if (!group.members?.includes(user?.uid ?? '')) {
    return (
      <>
        <>
          <CssBaseline />
          <Grid container justifyContent="center" marginTop={5}>
            {' '}
            {/* Overskriften på siden, hentet fra react */}
            <GroupsIcon fontSize="large" />
            <Typography variant="h4" marginLeft={2}>
              {group?.name}
            </Typography>
          </Grid>
        </>
        <Grid container justifyContent="center" marginTop={5}>
          {' '}
          {/* Beskrivelsen */}
          <Typography variant="body1" style={{width: 500}}>
            {group?.description}
          </Typography>
        </Grid>
        <Grid container justifyContent="center" marginTop={5}>
          <Typography variant="body1" style={{width: 500}}>
            {group?.members
              .map(
                (userId: IFirebaseUserId) =>
                  users.find(user => user.id === userId)?.name
              )
              .join(', ')}
          </Typography>
        </Grid>
        <Grid container justifyContent="center" marginTop={5}>
          <Typography variant="body1" style={{width: 500}}>
            {group?.interests.join(', ')}
          </Typography>
        </Grid>
      </>
    );
  }

  if (currentUser === null || !group.members.includes(currentUser?.uid)) {
    return (
      <ContainedAlert
        severity="error"
        message="Du må være med i gruppen for å kunne se denne siden."
      />
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const updateLists = (group: IFirebaseGroup) => {
    const superLikesList: ILikeListItem[] = group.likes
      .filter((like: IFirebaseLike) => like.super && like.id !== '')
      .map((like: IFirebaseLike) => {
        return {
          id: like.id,
          group: groups ? groups[like.id] : emptyGroupObject,
        };
      });
    setSuperLikesGroups(superLikesList);
    const superLikesID: string[] = group.likes
      .filter((like: IFirebaseLike) => like.super)
      .map((like: IFirebaseLike) => like.id);
    const likesList: ILikeListItem[] = group.likes
      .filter(
        (like: IFirebaseLike) =>
          !like.super && !superLikesID.includes(like.id) && like.id !== ''
      )
      .map((like: IFirebaseLike) => {
        return {
          id: like.id,
          group: groups ? groups[like.id] : emptyGroupObject,
        };
      });
    setlikesGroups(likesList);
    const matchList: IMatchListItem[] = (
      group.matches ?? []
    ).map<IMatchListItem>(match => ({
      ...(groups ? groups[match.id] : emptyGroupObject),
      ...match,
    }));

    setMatchedGroups(matchList);
  };

  const handleClickLike = (groupIdTo: string): void => {
    const like: IFirebaseLike = {
      id: groupID,
      super: false,
    };

    const groupTo: IFirebaseGroup = groups
      ? groups[groupIdTo]
      : emptyGroupObject;

    //Validering
    if (typeof groupTo.likes === 'undefined') {
      groupTo.likes = [];
    }

    if (typeof groupTo.matches === 'undefined') {
      groupTo.likes = [];
    }

    if (typeof group.likes === 'undefined') {
      groupTo.likes = [];
    }

    if (typeof group.matches === 'undefined') {
      groupTo.likes = [];
    }

    const matchTo: IFirebaseMatch = {
      id: groupID,
      date: new Date().toLocaleString(),
    };
    const matchFrom: IFirebaseMatch = {
      id: groupIdTo,
      date: new Date().toLocaleString(),
    };
    if (!group.likes.some((like: IFirebaseLike) => like.id === groupIdTo)) {
      groupTo.likes.push(like);
      firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
    } else {
      groupTo.likes = groupTo.likes.filter(
        (like: IFirebaseLike) => like.id !== groupID
      );
      group.likes = group.likes.filter(
        (like: IFirebaseLike) => like.id !== groupIdTo
      );
      group.matches.push(matchFrom);
      groupTo.matches.push(matchTo);
      firebaseGroups.child(groupID + '/matches').set(group.matches);
      firebaseGroups.child(groupIdTo + '/matches').set(groupTo.matches);
      firebaseGroups.child(groupID + '/likes').set(group.likes);
      firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
    }
    updateLists(group);
  };

  const handleDeleteLike = (groupIdTo: string): void => {
    group.likes = group.likes.filter(
      (like: IFirebaseLike) => like.id !== groupIdTo || like.super
    );
    firebaseGroups.child(groupID + '/likes').set(group.likes);
  };
  const handleDeleteSuperLike = (groupIdTo: string): void => {
    group.likes = group.likes.filter(
      (like: IFirebaseLike) => like.id !== groupIdTo || !like.super
    );
    firebaseGroups.child(groupID + '/likes').set(group.likes);
    updateLists(group);
  };

  const handleClick = (): void => {
    // Add current user to the group
    if (
      !input.members.includes(currentUser?.uid ?? '') &&
      currentUser !== null
    ) {
      input.members.push(currentUser?.uid);
    }

    const updatedData = {
      // Mulig vi må endre denne, da det er en bug når vi oppdaterer siden.
      ...group,
      ...input,
    };

    const updatedErrorMessages = validateGroupData(updatedData);

    if (groupHasErrorMessages(updatedErrorMessages)) {
      setErrorMessages(updatedErrorMessages);
      return;
    }

    // Clear error messages
    setErrorMessages(emptyErrorMessages);

    firebaseGroups
      .child(urlParams?.groupId ?? '')
      .update(updatedData)
      .then(() => {
        setUpdateSucceeded(true);
        setResetForm(!resetForm);
        setTimeout(() => {
          setUpdateSucceeded(false);
          setResetForm(!resetForm);
        }, 2000);
      });
  };

  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: 810,
        flexGrow: 0,
        backgroundColor: theme =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
      elevation={0}
    >
      <Grid container spacing={2}>
        <>
          <>
            <CssBaseline />
            <Grid container justifyContent="center" marginTop={3}>
              {' '}
              {/* Overskriften på siden, hentet fra react */}
              <GroupsIcon fontSize="large" />
              <Typography variant="h5" marginLeft={2}>
                {group?.name}
              </Typography>
            </Grid>
          </>
          <Grid container justifyContent="center" marginTop={2}>
            <Link to={'/groups/' + urlParams.groupId + '/findgroups'}>
              <Button variant={'contained'} size="small">
                Finn andre grupper
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Box
              component="img"
              sx={{
                height: 500,
                width: 500,
                maxHeight: {xs: 500, md: 250},
                maxWidth: {xs: 500, md: 250},
              }}
              alt="Student group."
              src={
                (input.imageUrl ?? '') !== ''
                  ? input.imageUrl
                  : (group.imageUrl ?? '') === ''
                  ? defaultGroupImageUrl
                  : group.imageUrl
              }
            />
          </Grid>
          <Grid container justifyContent="right" marginTop={1} item xs>
            {errorMessages.description === '' ? null : (
              <ContainedAlert message={errorMessages.description} />
            )}
            <TextField
              key="group-description"
              style={{width: 500}}
              id="outlined-multiline-static"
              variant="standard"
              label="Beskrivelse"
              multiline
              rows={4}
              inputProps={{maxLength: 240}}
              onChange={handleChange}
              defaultValue={group?.description}
              name="description"
              InputLabelProps={{shrink: true}}
              size="small"
            />
            <Grid container justifyContent="right" marginTop={2} item xs>
              {errorMessages.members === '' ? null : (
                <ContainedAlert message={errorMessages.members} />
              )}
              <Autocomplete
                key={'users' + resetForm}
                id="addUsers"
                multiple
                size="small"
                freeSolo
                style={{width: 500}}
                onChange={(
                  event: React.SyntheticEvent,
                  value: (string | IUserListItem)[]
                ) => {
                  const userIds = value.map(userListItem =>
                    typeof userListItem !== 'string'
                      ? userListItem.id
                      : userListItem
                  );
                  setInput({
                    ...input,
                    members: userIds,
                  });
                }}
                defaultValue={group?.members
                  .filter(userId => userId !== currentUser?.uid)
                  .map(userId => {
                    return (
                      users.find(userItem => userItem.id === userId) ?? {
                        id: '',
                        name: 'Ugyldig bruker',
                      }
                    );
                  })}
                options={users}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField {...params} label="Legg til medlemmer" />
                )}
              />
            </Grid>
            <Grid container justifyContent="right" marginTop={2} item xs>
              {errorMessages.interests === '' ? null : (
                <ContainedAlert message={errorMessages.interests} />
              )}
              <Autocomplete
                key={'interests' + resetForm}
                id="addInterests"
                multiple={true}
                freeSolo
                style={{width: 500}}
                size="small"
                onChange={(event: React.SyntheticEvent, value: string[]) => {
                  setInput({
                    ...input,
                    interests: value,
                  });
                }}
                defaultValue={group?.interests}
                options={interests}
                renderInput={params => (
                  <TextField {...params} label="Legg til interesser" />
                )}
              />
            </Grid>
            <Grid container justifyContent="right" marginTop={2} item xs>
              {errorMessages.location === '' ? null : (
                <ContainedAlert message={errorMessages.location} />
              )}
              <Autocomplete
                key={'location' + resetForm}
                id="addLocation"
                multiple={false}
                freeSolo
                style={{width: 500}}
                options={availableLocations}
                size="small"
                renderInput={params => (
                  <TextField {...params} label="Legg til lokasjon" />
                )}
                defaultValue={group.location}
                onChange={(
                  event: React.SyntheticEvent,
                  value: string | null
                ) => {
                  setInput({
                    ...input,
                    location: value ?? '',
                  });
                }}
              />
            </Grid>
            <Grid
              container
              justifyContent="right"
              marginTop={2}
              marginBottom={1}
              item
              xs
            >
              {errorMessages.imageUrl === '' ? null : (
                <ContainedAlert message={errorMessages.imageUrl} />
              )}
              <TextField
                key="group-image-input"
                style={{width: 500}}
                id="outlined-multiline-static"
                label="Gruppebilde"
                rows={4}
                inputProps={{maxLength: 240}}
                onChange={handleChange}
                size="small"
                defaultValue={group.imageUrl}
                name="imageUrl"
              />
            </Grid>
            {updateSucceeded ? (
              <ContainedAlert
                severity="success"
                message="Gruppen ble oppdatert!"
              />
            ) : null}
            <Grid
              container
              justifyContent="center"
              marginTop={2}
              marginBottom={5}
            >
              <Button variant="contained" onClick={handleClick}>
                Oppdater
              </Button>
            </Grid>
          </Grid>
        </>
      </Grid>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={10}
      >
        {superLikesGroups.length > 0 ? (
          <Typography
            variant="h4"
            marginLeft={2}
            marginTop={5}
            marginBottom={5}
          >
            Superlikes
          </Typography>
        ) : (
          <></>
        )}
        <Grid
          container
          spacing={5}
          alignItems="stretch"
          sx={{width: {sx: 1, sm: '70%'}}}
        >
          {superLikesGroups.length > 0 ? (
            superLikesGroups.map((likesGroup: ILikeListItem) => (
              <Grid item key={likesGroup.id} xs>
                <Card
                  sx={{
                    maxWidth: 245,
                    minWidth: {sx: 'default', sm: 200},
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate(
                      '/grouppage/' + urlParams.groupId + '/' + likesGroup.id
                    );
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {likesGroup.group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {likesGroup.group.description}
                    </Typography>
                  </CardContent>
                </Card>
                <Button onClick={() => handleClickLike(likesGroup.id)}>
                  Like
                </Button>
                <Button onClick={() => handleDeleteSuperLike(likesGroup.id)}>
                  Slett
                </Button>
              </Grid>
            ))
          ) : (
            <></>
          )}
        </Grid>
        {likesGroups.length > 0 && gold ? (
          <Typography
            variant="h4"
            marginLeft={2}
            marginTop={5}
            marginBottom={5}
          >
            Likes
          </Typography>
        ) : (
          <></>
        )}
        <Grid
          container
          spacing={5}
          alignItems="stretch"
          sx={{width: {sx: 1, sm: '70%'}}}
        >
          {likesGroups.length > 0 && gold ? (
            likesGroups.map((likesGroup: ILikeListItem) => (
              <Grid item key={likesGroup.id} xs>
                <Card
                  sx={{
                    maxWidth: 245,
                    minWidth: {sx: 'default', sm: 200},
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate(
                      '/grouppage/' + urlParams.groupId + '/' + likesGroup.id
                    );
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {likesGroup.group.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {likesGroup.group.description}
                    </Typography>
                  </CardContent>
                </Card>
                <Button onClick={() => handleClickLike(likesGroup.id)}>
                  Like
                </Button>
                <Button onClick={() => handleDeleteLike(likesGroup.id)}>
                  Slett
                </Button>
              </Grid>
            ))
          ) : (
            <></>
          )}
        </Grid>
        <Grid
          marginTop={5}
          container
          spacing={5}
          alignItems="stretch"
          sx={{width: {sx: 1, sm: '70%'}}}
        ></Grid>
        <Typography variant="h4" marginLeft={2} marginTop={5} marginBottom={5}>
          Matchede grupper
        </Typography>
        <Grid
          container
          spacing={5}
          alignItems="stretch"
          sx={{width: {sx: 1, sm: '70%'}}}
        >
          {matchedGroups.map(matchedGroup => (
            <Grid item key={matchedGroup.id} xs>
              <Card
                sx={{
                  maxWidth: 245,
                  minWidth: {sx: 'default', sm: 200},
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigate(
                    '/grouppage/' + urlParams.groupId + '/' + matchedGroup.id
                  );
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {matchedGroup.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {matchedGroup.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    marginTop={2}
                    marginBottom={1}
                  >
                    Matchdato:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {matchedGroup.date}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddToList;
