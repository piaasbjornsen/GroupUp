import {
  Grid,
  Button,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  Paper,
  CardMedia,
  CardActions,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
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
import {Link, useNavigate} from 'react-router-dom';
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
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

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
  const {currentUser} = useContext(AuthContext);
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
  const navigate = useNavigate();
  const [groups, setGroups] = useState<IFirebaseDb['groups']>();
  const [gold, setGold] = useState<boolean>(false);
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false);
  const userInfo = isGroupAdmin ? 'Rediger gruppeprofil' : 'Gruppeprofil';
  const currentGroup = useSelector((state: RootState) => state.currentGroup);
  //Select
  const [meetingFrequency, setMeetingFrequency] = React.useState<string>('');
  const handleChangeSelect = (e: SelectChangeEvent) => {
    setMeetingFrequency(e.target.value);
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroups(groups);
      const thisGroup = groups[currentGroup.groupId ?? ''];
      setIsGroupAdmin(thisGroup.groupAdmin === currentUser?.uid);
      if (groups[currentGroup.groupId ?? ''] ?? false) {
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
            name: users[userId]?.name,
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
    firebaseGroups.child(currentGroup.groupId ?? '').once('value', snapshot => {
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
              !like.super && !superLikesID?.includes(like.id) && like.id !== ''
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
          setMeetingFrequency(group.meetingFrequency);
        });
      });
    });
  }, []);

  if (invalidGroupId) {
    return <ContainedAlert severity="error" message="Ugyldig gruppe id" />;
  }

  if (
    group === null ||
    group === emptyGroupObject ||
    users === null ||
    interests === null ||
    currentUser === null
  ) {
    return <ContainedAlert severity="info" message="Laster inn..." />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({
      ...input,
      [e.target?.name]: e.target.value,
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
          !like.super && !superLikesID?.includes(like.id) && like.id !== ''
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
      id: currentGroup.groupId ?? '',
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
      id: currentGroup.groupId ?? '',
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
        (like: IFirebaseLike) => like.id !== currentGroup.groupId
      );
      group.likes = group.likes.filter(
        (like: IFirebaseLike) => like.id !== groupIdTo
      );
      group.matches.push(matchFrom);
      groupTo.matches.push(matchTo);
      firebaseGroups
        .child(currentGroup.groupId + '/matches')
        .set(group.matches);
      firebaseGroups.child(groupIdTo + '/matches').set(groupTo.matches);
      firebaseGroups.child(currentGroup.groupId + '/likes').set(group.likes);
      firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
    }
    updateLists(group);
  };

  const handleDeleteLike = (groupIdTo: string): void => {
    group.likes = group.likes.filter(
      (like: IFirebaseLike) => like.id !== groupIdTo || like.super
    );
    firebaseGroups.child(currentGroup.groupId + '/likes').set(group.likes);
  };
  const handleDeleteSuperLike = (groupIdTo: string): void => {
    group.likes = group.likes.filter(
      (like: IFirebaseLike) => like.id !== groupIdTo || !like.super
    );
    firebaseGroups.child(currentGroup.groupId + '/likes').set(group.likes);
    updateLists(group);
  };

  const handleClick = (): void => {
    // Add current user to the group
    if (
      !input.members?.includes(currentUser?.uid ?? '') &&
      currentUser !== null
    ) {
      input.members.push(currentUser?.uid);
    }
    setGroup({...group, ...input});

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
      .child(currentGroup.groupId ?? '')
      .update(updatedData)
      .then(() => {
        setUpdateSucceeded(true);
        console.log(group);
        setTimeout(() => {
          setUpdateSucceeded(false);
        }, 2000);
      });
  };

  return (
    <>
      <Grid
        sx={{
          width: '100%',
          height: '300px',
          backgroundImage:
            'url(' +
            ((input?.imageUrl ?? '') !== ''
              ? input.imageUrl
              : group.imageUrl ?? '/assets/background_image.jpg') +
            ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <Typography
          variant="h4"
          marginLeft={3}
          paddingTop={3}
          sx={{color: 'white', textShadow: '1px 1px 10px #5f5f5f'}}
        >
          {group?.name}
        </Typography>
      </Grid>
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          width: {sx: 'default', sm: '80%'},
          flexGrow: 0,
        }}
        elevation={0}
      >
        <Grid container spacing={2} marginTop={1}>
          <Grid
            container
            justifyContent="left"
            item
            sx={{width: 500}}
            marginRight={5}
          >
            {/* VENSTRE SIDE */}
            <Grid item xs={12} marginBottom={2}>
              <Typography variant="h4">{userInfo}</Typography>
            </Grid>
            {errorMessages?.description === '' ? null : (
              <ContainedAlert message={errorMessages.description} />
            )}
            <TextField
              key="group-description"
              style={{width: 500}}
              id="outlined-multiline-static"
              variant="standard"
              label="Beskrivelse"
              multiline
              disabled={!isGroupAdmin}
              rows={4}
              inputProps={{maxLength: 240}}
              onChange={handleChange}
              defaultValue={group?.description}
              name="description"
              InputLabelProps={{shrink: true}}
              size="small"
            />
            <Grid container marginTop={2} item xs>
              {errorMessages.members === '' ? null : (
                <ContainedAlert message={errorMessages.members} />
              )}
              <Autocomplete
                key={'users' + resetForm}
                id="addUsers"
                multiple
                size="small"
                freeSolo
                disabled={!isGroupAdmin}
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
                getOptionLabel={option => option?.name}
                renderInput={params => (
                  <TextField {...params} label="Medlemmer" variant="standard" />
                )}
              />
            </Grid>
            <Grid container marginTop={2} item xs>
              {errorMessages.interests === '' ? null : (
                <ContainedAlert message={errorMessages.interests} />
              )}
              <Autocomplete
                key={'interests' + resetForm}
                id="addInterests"
                multiple={true}
                freeSolo
                disabled={!isGroupAdmin}
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
                  <TextField
                    {...params}
                    label="Interesser"
                    variant="standard"
                  />
                )}
              />
            </Grid>
            <Grid container marginTop={2} item xs>
              {errorMessages.location === '' ? null : (
                <ContainedAlert message={errorMessages.location} />
              )}
              <Autocomplete
                key={'location' + resetForm}
                id="addLocation"
                multiple={false}
                freeSolo
                disabled={!isGroupAdmin}
                style={{width: 500}}
                options={availableLocations}
                size="small"
                renderInput={params => (
                  <TextField {...params} label="Lokasjon" variant="standard" />
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
            <Grid container marginTop={2} item xs>
              {errorMessages.imageUrl === '' ? null : (
                <ContainedAlert message={errorMessages.imageUrl} />
              )}
              <TextField
                key="group-image-input"
                style={{width: 500}}
                id="outlined-multiline-static"
                label="Gruppebilde"
                rows={4}
                disabled={!isGroupAdmin}
                inputProps={{maxLength: 240}}
                onChange={handleChange}
                size="small"
                variant="standard"
                defaultValue={group.imageUrl}
                name="imageUrl"
              />
            </Grid>
            <Grid container marginTop={2} item xs>
              <TextField
                style={{width: 500}}
                variant="standard"
                required
                disabled={!isGroupAdmin}
                size="small"
                id="outlined-required"
                type="date"
                label="Møtedato"
                InputLabelProps={{shrink: true}}
                onChange={handleChange}
                value={input.meetingDate ?? new Date(2000, 0, 1)}
                name="meetingDate"
              />
            </Grid>
            <Grid container marginTop={2} marginBottom={1} item xs>
              <FormControl variant="standard" sx={{minWidth: 485}}>
                <InputLabel id="demo-simple-select-filled-label">
                  Møtefrekvens
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={meetingFrequency}
                  disabled={!isGroupAdmin}
                  name="meetingFrequency"
                  onChange={handleChangeSelect}
                >
                  <MenuItem value={'Gruppen ønsker å møtes 1 gang'}>1</MenuItem>
                  <MenuItem value={'Gruppen ønsker å møtes 1-3 ganger'}>
                    1-3
                  </MenuItem>
                  <MenuItem value={'Gruppen ønsker å møtes 3-5 ganger'}>
                    3-5
                  </MenuItem>
                  <MenuItem value={'Gruppen ønsker å møtes mer enn 5 ganger'}>
                    5+
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {updateSucceeded ? (
              <ContainedAlert
                severity="success"
                message="Gruppen ble oppdatert!"
              />
            ) : null}
            <Grid
              container
              marginTop={2}
              marginBottom={5}
              justifyContent="center"
            >
              {isGroupAdmin ? (
                <Button variant="outlined" onClick={handleClick}>
                  OPPDATER GRUPPE
                </Button>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction={'column'}
            sx={{width: 0, flexGrow: 1, verticalAlign: 'top'}}
          >
            {/* HØYRE SIDE */}
            {superLikesGroups.length > 0 ? (
              <Typography variant="h4" marginBottom={1} sx={{width: '100%'}}>
                Mottatte superlikes
              </Typography>
            ) : null}
            {superLikesGroups.length > 0 ? (
              <Grid
                container
                item
                spacing={5}
                sx={{width: {sx: 1}}}
                marginBottom={2}
              >
                {superLikesGroups.map((likesGroup: ILikeListItem) => (
                  <Grid item key={likesGroup.id} xs>
                    <Card
                      sx={{
                        maxWidth: 245,
                        minWidth: {sx: 'default', sm: 200},
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent
                        onClick={() => {
                          navigate('/groups/' + likesGroup.id);
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {likesGroup.group?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {likesGroup.group?.description.length > 100
                            ? likesGroup.group?.description.substring(0, 97) +
                              '...'
                            : likesGroup.group?.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => handleClickLike(likesGroup.id)}>
                          Match
                        </Button>
                        <Button
                          onClick={() => handleDeleteSuperLike(likesGroup.id)}
                        >
                          Slett
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : null}
            {likesGroups.length > 0 && gold ? (
              <Typography variant="h4" marginTop={1} marginBottom={1}>
                Mottatte likes
              </Typography>
            ) : null}
            {likesGroups.length > 0 && gold ? (
              <Grid
                container
                spacing={5}
                sx={{width: {sx: 1, sm: '70%'}}}
                marginBottom={2}
              >
                {likesGroups.map((likesGroup: ILikeListItem) => (
                  <Grid item key={likesGroup.id} xs>
                    <Card
                      sx={{
                        maxWidth: 245,
                        minWidth: {sx: 'default', sm: 200},
                        cursor: 'pointer',
                      }}
                    >
                      <CardContent
                        onClick={() => {
                          navigate('/groups/' + likesGroup.id);
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {likesGroup.group?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {likesGroup.group?.description.length > 100
                            ? likesGroup.group?.description.substring(0, 97) +
                              '...'
                            : likesGroup.group?.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => handleClickLike(likesGroup.id)}>
                          Like
                        </Button>
                        <Button onClick={() => handleDeleteLike(likesGroup.id)}>
                          Slett
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <></>
            )}
            <CssBaseline />
            <Typography variant="h4" marginBottom={2}>
              Matchede grupper
            </Typography>
            <Grid container item spacing={2} marginLeft={0.3}>
              {matchedGroups.length === 0 ? (
                <Typography variant="body2" marginTop={1}>
                  Dere har ikke matchet med noen grupper..
                  <br />
                  Gå til <Link to="/groups/find">finn grupper</Link> og lik noen
                  grupper for å komme i gang!
                </Typography>
              ) : null}
              {matchedGroups.map(matchedGroup => (
                <Grid item key={matchedGroup.id} xs>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: 245,
                      minWidth: {sx: 'default', sm: 200},
                      cursor: 'pointer',
                      minHeight: '100%',
                    }}
                    onClick={() => {
                      navigate('/groups/' + matchedGroup.id);
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={matchedGroup.imageUrl ?? defaultGroupImageUrl}
                      alt="Gruppebilde"
                    />
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{flexGrow: 1, pb: 1}}
                      >
                        {matchedGroup?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Matchet {matchedGroup.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddToList;
