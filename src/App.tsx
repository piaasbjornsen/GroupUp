import React, {useContext} from 'react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {HashRouter, Route, Routes} from 'react-router-dom';
import theme from './theme';
import './App.css';
import Login from './pages/login/Login';
import {AuthContext} from './context/AuthContext';
import Header from './features/header/Header';
import MyGroups from './pages/mygroups/MyGroups';
import './App.css';

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
              <Route path="/mygroups" element={<MyGroups />}></Route>
            </Routes>
          </>
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
