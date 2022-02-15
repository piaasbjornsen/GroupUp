import {Button, CssBaseline, ThemeProvider} from '@mui/material';
import React, {useContext} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import theme from './theme';
import './App.css';
import Login from './pages/login/Login';
import {AuthContext} from './context/AuthContext';
import {signOut} from './service/firebase';

function App() {
  const user = useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        {user === null ? (
          <Login />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Button variant="contained" onClick={signOut}>
                  Sign out
                </Button>
              }
            ></Route>
          </Routes>
        )}
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
