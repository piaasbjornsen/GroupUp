import {CssBaseline, ThemeProvider} from '@mui/material';
import React from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import theme from './theme';
import './App.css';
import Login from './pages/login/Login';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
