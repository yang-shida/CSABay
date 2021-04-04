import React from 'react';
import './App.less';
import {useState, useEffect} from 'react'
import { Result, Button, message } from 'antd';

import NavBar from './components/NavBar'
import SignupForm from './components/SignupForm'
import MainPage from './components/MainPage'
import CreatePostPage from './components/CreatePostPage'
import ProfilePage from './components/ProfilePage'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import LoginPage from './components/LoginPage';
import auth from './auth/auth';
import ProtectedRoute from './auth/ProtectedRoute'
import ForgotPasswordPage from './components/ForgotPasswordPage';
import axios from 'axios';

const base_ = "http://localhost:3001";

const App = () => {

  const [userInfo, setUserInfo] = useState();

  useEffect(
    () => {
      if(!auth.isAuthenticated()){
        axios.get(base_ + '/get-user-info')
          .then(
            (res) => {
              console.log(res.data)
              if(res.data.code===1){
                console.log(res.data.message)
              }
              else{
                auth.login(
                  () => {
                    setUserInfo(res.data.data)
                  }
                )
                
              }
            }
          )
          .catch(
            (err) => {
              message.error("Something went wrong!")
              console.log(err)
            }
          )
      }
    }, []
  )

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            path='/'
            exact render={
              auth.isAuthenticated()?
              ((props)=>(
                <>
                  {userInfo===undefined?"":<NavBar isAuthenticated={true} user={userInfo} currentRoute={"home"} routerProps={props} setUserInfo={setUserInfo}/>}
                  {userInfo===undefined?"":<MainPage isAuthenticated={true} user={userInfo} setUser={setUserInfo}></MainPage>}
                </>
              ))
              :
              ((props)=>(
                <>
                  <NavBar isAuthenticated={false} currentRoute={"home"} routerProps={props} setUserInfo={setUserInfo}/>
                  <MainPage isAuthenticated={false} setUser={setUserInfo} routerProps={props}></MainPage>
                </>
              ))
            }
          ></Route>

          <Route
            path='/login'
            exact render={
              (props)=>(
                <>
                  <NavBar isAuthenticated={false} currentRoute={"login"} routerProps={props} setUserInfo={setUserInfo}/>
                  <LoginPage routerProps={props} setUserInfo={setUserInfo} />
                </>
              )
            }
          ></Route>

          <Route
            path='/forgot-password'
            exact render={
              (props)=>(
                <>
                  <NavBar isAuthenticated={false} currentRoute={"forgot-password"} routerProps={props} setUserInfo={setUserInfo}/>
                  <ForgotPasswordPage routerProps={props} />
                </>
              )
            }
          ></Route>

          <Route
            path='/register'
            exact render={
              (props)=>(
                <>
                  <NavBar isAuthenticated={false} currentRoute={"register"} routerProps={props} setUserInfo={setUserInfo}/>
                  <SignupForm></SignupForm>
                </>
              )
            }
          ></Route>
          
          <ProtectedRoute
            path='/create-post'
            exact render={
              (props)=>(
                <>
                  {userInfo===undefined?"":<NavBar isAuthenticated={true} user={userInfo} currentRoute={"create-post"} routerProps={props} setUserInfo={setUserInfo}/>}
                  {userInfo===undefined?"":<CreatePostPage user={userInfo}/>}
                </>
              )
            }
          ></ProtectedRoute>

          <ProtectedRoute
            path='/profile'
            exact render={
              (props)=>(
                <>
                  {userInfo===undefined?"":<NavBar isAuthenticated={true} user={userInfo} currentRoute={"profile"} routerProps={props} setUserInfo={setUserInfo}/>}
                  {userInfo===undefined?"":<ProfilePage user={userInfo} setUser={setUserInfo}/>}
                  
                </>
              )
            }
          ></ProtectedRoute>

          <Route
            path="/missing-permission"
            render={
              (props) => (
                <Result
                  status="403"
                  title="403"
                  subTitle="Sorry, you are need to login to see this page."
                  extra={[
                    <Link to="/">
                      <Button key="to-home" type="primary">
                        Back Home
                      </Button>
                    </Link>
                    ,
                    <Link to="/login">
                      <Button key="to-login" type="primary">
                        Go to Login
                      </Button>
                    </Link>
                    
                  ]}
                />
              )
            }
          ></Route>

          <Route
            path="*"
            render={
              (props) => (
                <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
                />
              )
            }
          ></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;