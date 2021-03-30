import React from 'react';
import './App.less';
import {useState, useEffect} from 'react'

import NavBar from './components/NavBar'
import SignupForm from './components/SignupForm'
import MainPage from './components/MainPage'
import CreatePostPage from './components/CreatePostPage'
import ProfilePage from './components/ProfilePage'
import {BrowserRouter as Router, Route} from 'react-router-dom'

const App = () => {
  const [userInfo, setUserInfo] = useState();

  useEffect(
    ()=>{
      const getUser = async() =>{
        const userFromServer = await fetchUser(1)
        setUserInfo(userFromServer)
      }

      getUser()
      
    }, []
  )

  const fetchUser = async(userID) =>{
    const res = await fetch(`http://localhost:8080/users/${userID}`)
    const data = await res.json()
    return data
  }

  return (
    <Router>
      <div className="App">
        <Route
          path='/'
          exact render={
            ()=>(
              <>
                {userInfo===undefined?"":<NavBar user={userInfo} currentRoute={"home"}/>}
                {userInfo===undefined?"":<MainPage user={userInfo} setUser={setUserInfo}></MainPage>}
              </>
            )
          }
        ></Route>

        <Route
          path='/register'
          exact render={
            ()=>(
              <>
                {userInfo===undefined?"":<NavBar user={userInfo} currentRoute={"register-page"}/>}
                <SignupForm></SignupForm>
              </>
            )
          }
        ></Route>
        
        <Route
          path='/create-post'
          exact render={
            ()=>(
              <>
                {userInfo===undefined?"":<NavBar user={userInfo} currentRoute={"create-post"}/>}
                {userInfo===undefined?"":<CreatePostPage user={userInfo}/>}
              </>
            )
          }
        ></Route>

        <Route
          path='/profile'
          exact render={
            ()=>(
              <>
                {userInfo===undefined?"":<NavBar user={userInfo} currentRoute={"profile"}/>}
                {userInfo===undefined?"":<ProfilePage user={userInfo} setUser={setUserInfo}/>}
                
              </>
            )
          }
        ></Route>

        
      </div>
    </Router>
  )
}

export default App;