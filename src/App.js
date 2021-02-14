import React from 'react';
import { Button } from 'antd';
import './App.less';

import NavBar from './components/NavBar'
import SignupForm from './components/SignupForm'

const App = () => (
  <div className="App">
    <NavBar></NavBar>
    <SignupForm></SignupForm>
  </div>
);

export default App;