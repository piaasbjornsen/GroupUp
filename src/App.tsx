import React, {useContext} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {CssBaseline, Grid, ThemeProvider} from '@mui/material';
import theme from './theme';
import './App.css';
import Login from './pages/login/Login';
import {AuthContext} from './context/AuthContext';
import Header from './features/header/Header';
import MyGroups from './pages/mygroups/MyGroups';
import './App.css';
import AdminPage from './pages/admin/AdminPage';
import CreateGroup from './pages/creategroup/CreateGroup';
import FindGroups from './pages/findgroups/FindGroups';
import MyGroup from './pages/mygroup/MyGroup';
import GroupPage from './pages/findgroup/GroupPage';
import SetUserData from './pages/login/SetUserData';
import {useSelector} from 'react-redux';
import {RootState} from './redux/store';
import {ContainedAlert} from './features/containedalert/ContainedAlert';
import Footer from './features/footer/Footer';
import {groups as firebaseGroups} from './service/firebase';
import {IFirebaseDb} from './interfaces/firebase';

function App() {
  const {currentUser, loading} = useContext(AuthContext);
  const currentGroup = useSelector((state: RootState) => state.currentGroup);

  const setupGroupAdmins = () => {
    // Sets group admins to groups that do not contain it
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      Object.entries(groups).forEach(groupData => {
        if ((groupData[1].groupAdmin ?? '') === '') {
          // Set gruppeadmin
          const firstMemberId = groupData[1].members.find(
            memberId => memberId !== undefined
          );
          if (firstMemberId !== undefined) {
            firebaseGroups
              .child(groupData[0])
              .child('groupAdmin')
              .set(firstMemberId);
          } else {
            // Group has no members
            console.log('Group ' + groupData[0] + ' has no members');
          }
        }
      });
    });
  };
  setupGroupAdmins();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        {loading === true ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{minHeight: '100vh'}}
          >
            <ContainedAlert severity="info" message="Laster inn..." />
          </Grid>
        ) : currentUser === null ? (
          <Login />
        ) : currentUser.gold === undefined ||
          currentUser.dateOfBirth === '' ||
          currentUser.dateOfBirth === undefined ? (
          <SetUserData />
        ) : currentGroup?.groupId === undefined ? (
          <MyGroups />
        ) : (
          <Grid container direction={'column'} minHeight={'100vh'}>
            <Header />
            <Routes>
              <Route path="/" element={<MyGroup />}></Route>
              <Route path="/groups/change" element={<MyGroups />}></Route>
              <Route path="/groups/create" element={<CreateGroup />}></Route>
              <Route path="/groups/find" element={<FindGroups />}></Route>
              <Route path="/groups/:groupIdTo" element={<GroupPage />}></Route>
              <Route path="/admin" element={<AdminPage />}></Route>
            </Routes>
            <Footer />
          </Grid>
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
