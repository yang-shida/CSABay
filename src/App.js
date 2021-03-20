import React from 'react';
import { Button } from 'antd';
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

      console.log('fetching user')
      
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
        {userInfo===undefined?"":<NavBar user={userInfo} />}

        <Route
          path='/'
          exact render={
            ()=>(
              <>
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
                <CreatePostPage />
              </>
            )
          }
        ></Route>

        <Route
          path='/profile'
          exact render={
            ()=>(
              <>
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