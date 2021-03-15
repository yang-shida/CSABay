import React from 'react';
import { Button } from 'antd';
import './App.less';
import {useState, useEffect} from 'react'

import NavBar from './components/NavBar'
import SignupForm from './components/SignupForm'
import MainPage from './components/MainPage'
import CreatePostPage from './components/CreatePostPage'

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
    <div className="App">
      <NavBar />
      {/* <SignupForm></SignupForm> */}
      {/* {userInfo===undefined?"":<MainPage user={userInfo} setUser={setUserInfo}></MainPage>} */}
      <CreatePostPage />
    </div>
  )
}

export default App;