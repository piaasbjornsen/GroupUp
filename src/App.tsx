import React, {useContext} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@mui/material';
import theme from './theme';
import './App.css';
import Login from './pages/login/Login';
import {AuthContext} from './context/AuthContext';
import Header from './features/header/Header';
import MyGroups from './pages/mygroups/MyGroups';
import './App.css';
import AdminPage from './pages/admin/AdminPage';
import CreateGroup from './pages/creategroup/CreateGroup';
import GroupTable from './pages/findgroups/GroupTable';
import ThisGroup from './pages/mygroups/ThisGroup';

function App() {
  const user = useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        {user === null ? (
          <Login />
        ) : (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<MyGroups />}></Route>
              <Route path="/admin" element={<AdminPage />}></Route>
              <Route path="/creategroup" element={<CreateGroup />}></Route>
              <Route path="/findgroups" element={<GroupTable />}></Route>
              <Route path="/groups/:groupId" element={<ThisGroup />}></Route>
            </Routes>
          </>
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
