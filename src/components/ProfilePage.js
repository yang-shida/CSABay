import React, {useEffect, useState} from 'react'
import { Avatar, Image, Divider, Row, Col, Layout, Menu } from 'antd';
import Cards from './Cards'

const profileContainerStyle = {
    // borderWidth: '2px',
    // borderStyle: 'solid',
    // borderColor: 'black',

    width: '80%',
    margin: 'auto'
}

const profileSideBarStyle = {
    // borderWidth: '2px',
    // borderStyle: 'solid',
    // borderColor: 'black',

    width: '20%',
    float: 'left',
    padding: '10px',
    paddingTop: '40px'
}

const profilePictureStyle = {
    width: '90%',
    height: 'auto',

    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#E0E0E0',
    marginBottom: '10px'
}

const basicInfoStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#A0A0A0',
}

const dividerLayout = {
    span: 24
}

const profileMainBodyStyle = {
    // borderWidth: '2px',
    // borderStyle: 'solid',
    // borderColor: 'black',

    width: '80%',
    float: 'right',
    padding: '10px'
}

const defaultMenuKey = 1

const ProfilePage = ({user}) => {
    const [myPosts, setMyPosts] = useState([])
    const [mySavedPosts, setMySavedPosts] = useState([])
    const [currentMenuKey, setCurrentMenuKey] = useState(defaultMenuKey)

    useEffect(
        () => {

            const getMyPosts = async()=>{
                const postsFromServer = await fetchMyPosts()
                setMyPosts(postsFromServer)
            }

            getMyPosts()

            const getMySavedPosts = async()=>{
                var temp=[]
                for(var i=0; i<user.savedPosts.length; i++){
                    const fetchedPost = await fetchPost(user.savedPosts[i])
                    temp.push(fetchedPost)
                }
                setMySavedPosts(temp)
            }
            
            getMySavedPosts()

        }, []
    )

    const fetchMyPosts = async () => {
        const res = await fetch(`http://localhost:8080/posts?userID=${user.id}`)
        const data = await res.json()
        
        return data
    }

    const fetchPost = async (postID) => {
        const res = await fetch(`http://localhost:8080/posts/${postID}`)
        const data = await res.json()

        console.log('Fetching Post ID: ', postID)
        
        return data
    }

    const onSelectMenu = async (selectedKeys) => {
        setCurrentMenuKey(Number(selectedKeys.key))
    }

    // const deleteSavedPosts = async (postID) => {
    //     console.log("Deleting saved post id: ", postID)
    //     var updatedSavedPosts = user.savedPosts
    //     updatedSavedPosts.splice(user.savedPosts.indexOf(postID),1).sort((a, b) => a - b)
    //     const updatedUser = {...user, savedPosts: updatedSavedPosts}

    //     const res = await fetch(`http://localhost:8080/users/${user.id}`,
    //         {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //             body: JSON.stringify(updatedUser),
    //         }
    //     )

    //     const data = await res.json()

    //     setUser(updatedUser)
    // }

    const onClickStar = (postID) => {
        // if(user.savedPosts.includes(postID)){
        //     deleteSavedPosts(postID)
        // }
        // else{
        //     addSavedPosts(postID)
        // }
        console.log('Star post: ', postID)
    }

    const onClickDelete = (postID) => {
        console.log('Delete post: ', postID)
    }

    return (
        <div id="profile-container" style={profileContainerStyle}>
            <div id="profile-side-bar" style={profileSideBarStyle}>
                <Avatar size="default" src="../CSA_icon.jpg" style={profilePictureStyle}/>
                <div style={basicInfoStyle}>
                    {user.firstName} {user.lastName}
                </div>
                <div style={basicInfoStyle}>
                    {user.email.toLowerCase()}
                </div>

                <Row>
                    <Col {...dividerLayout} >
                        <Divider orientation="left">
                        </Divider>
                    </Col>
                </Row>

                <Menu id="profile-side-bar-menu" mode="inline" defaultSelectedKeys={[`${defaultMenuKey}`]} onSelect={(selectedKeys)=>onSelectMenu(selectedKeys)}>
                    <Menu.Item key="1">
                        My Posts
                    </Menu.Item>
                    <Menu.Item key="2">
                        Favorite Posts
                    </Menu.Item>
                    <Menu.Item key="3">
                        Change Password
                    </Menu.Item>
                    <Menu.Item key="4">
                        Edit Profile
                    </Menu.Item>
                </Menu>
            
            </div>
            
            <div id="profile-main-body" style={profileMainBodyStyle}>
                {
                    currentMenuKey==1?
                    <Cards posts={myPosts} displayDelete={true} onClickDelete={onClickDelete}></Cards>:
                    currentMenuKey==2?
                    <Cards posts={mySavedPosts} displayDelete={false} favoriteIDs={user.savedPosts} onClickStar={onClickStar}></Cards>:
                    'x'
                }
            </div>


        </div>
    )
}

export default ProfilePage
