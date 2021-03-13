import React from 'react';
import { Button } from 'antd';
import './App.less';

import NavBar from './components/NavBar'
import SignupForm from './components/SignupForm'
import MainPage from './components/MainPage'

const App = () => (
  <div className="App">
    <NavBar></NavBar>
    {/* <SignupForm></SignupForm> */}
    <MainPage></MainPage>
  </div>
);

export default App;