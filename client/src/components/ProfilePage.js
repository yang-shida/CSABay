import React, {useEffect, useState} from 'react'
import { Avatar, Image, Divider, Row, Col, Layout, Menu, Modal, Upload, Tooltip, message  } from 'antd';
import Cards from './Cards'
import ChangePasswordPage from './ChangePasswordPage'
import EditContactInfoPage from './EditContactInfoPage'
import ProductDetailPage from './ProductDetailPage'
import EditPostPage from './EditPostPage'
import ImgCrop from 'antd-img-crop'


import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST, S3_DELETE_BY_KEY, S3_UPLOAD_SINGLE_FILE} from './S3'

const { Sider } = Layout;

const profileContainerStyle = {
    width: '80%',
    margin: 'auto'
}

const profileSideBarStyle = {
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
    marginBottom: '10px',

    cursor: 'pointer'
}

const basicInfoStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#A0A0A0',
    textAlign: 'left'
}

const dividerLayout = {
    span: 24
}

const profileMainBodyStyle = {
    width: '80%',
    float: 'right',
    padding: '10px'
}

const defaultMenuKey = 1

const ProfilePage = ({user, setUser}) => {
    const [myPosts, setMyPosts] = useState([])
    const [mySavedPosts, setMySavedPosts] = useState([])
    const [currentMenuKey, setCurrentMenuKey] = useState(defaultMenuKey)

    const [sideBarWidth, setSideBarWidth] = useState(`${window.innerWidth>=992?"20%":"100%"}`)

    const [selectedPostID, setSelectedPostID] = useState('')
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const [isProductDetailVisible, setIsProductDetailVisible] = useState(false)
    const [isEditPostVisible, setIsEditPostVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedPostUserInfo, setSelectedPostUserInfo] = useState('')

    const [value, setValue] = useState(0)

    const [profilePictureURL, setProfilePictureURL] = useState("")


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
                    if(fetchedPost==='Post Not Found'){
                        deleteSavedPosts(user.savedPosts[i])
                    }
                    else{
                        temp.push(fetchedPost)
                    }
                }
                setMySavedPosts(temp)
            }
            
            getMySavedPosts()

        }, [isEditPostVisible]
    )

    useEffect(
        () => {
            if(user.profilePictureKey !== ""){
                setProfilePictureURL(S3_GET(user.profilePictureKey))
            }
        }, [user]
    )

    const fetchMyPosts = async () => {
        const res = await fetch(`http://localhost:8080/posts1?userID=${user.email.toLowerCase()}`)
        if(res.status===404){
            return 'User Not Found'
        }
        else{
            const data = await res.json()
            return data
        }
        
    }

    const fetchPost = async (postID) => {
        const res = await fetch(`http://localhost:8080/posts1/${postID}`)
        if(res.status===404){
            return 'Post Not Found'
        }
        else{
            const data = await res.json()
            return data
        }
    }

    const fetchUser = async(email) =>{
        const res = await fetch(`http://localhost:8080/users?email=${email.toLowerCase()}`)
        const data = await res.json()
        return data[0]
    }

    const onSelectMenu = async (selectedKeys) => {
        setCurrentMenuKey(Number(selectedKeys.key))
    }

    const addSavedPosts = async (postID) => {
        const updatedUser = {...user, savedPosts: [...user.savedPosts, postID].sort((a, b) => a - b)}

        const res = await fetch(`http://localhost:8080/users/${user.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedUser),
            }
        )

        const data = await res.json()

        setUser(updatedUser)
    }

    const deleteSavedPosts = async (postID) => {
        var updatedSavedPosts = user.savedPosts
        updatedSavedPosts.splice(user.savedPosts.indexOf(postID),1).sort((a, b) => a - b)
        const updatedUser = {...user, savedPosts: updatedSavedPosts}

        const res = await fetch(`http://localhost:8080/users/${user.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedUser),
            }
        )

        const data = await res.json()

        setUser(updatedUser)
    }

    const onClickStar = (postID) => {
        if(user.savedPosts.includes(postID)){
            deleteSavedPosts(postID)
        }
        else{
            addSavedPosts(postID)
        }
    }

    const deletePost = async (postID) => {
        const postToDelete = await fetchPost(postID)
        for(const key in postToDelete.pictureKeyArray){
            S3_DELETE_BY_KEY(postToDelete.pictureKeyArray[key])
        }
        await fetch(`http://localhost:8080/posts1/${postID}`, {
            method: 'DELETE',
        })
        setMyPosts(myPosts.filter((post) => post.id !== postID))
        
    }

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = () => {
        deletePost(selectedPostID)
        setIsDeleteModalVisible(false)
        setTimeout(
            () => {
                setIsProductDetailVisible(false)
            }, 500
        )
        
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const onClickDelete = (postID) => {
        setSelectedPostID(postID)
        showDeleteModal()
    }

    const onClickEdit = (post) => {
        setValue(value+1)
        setSelectedPost(post)
        setIsEditPostVisible(true)
        setIsProductDetailVisible(false)
    }

    const onClickCard = async (post, e) => {
        setSelectedPost(post)
        const userFromServer = await fetchUser(post.userID)
        setSelectedPostUserInfo(userFromServer)
        setIsProductDetailVisible(true)
    }

    const onCloseProductDetail = () => {
        setIsProductDetailVisible(false)
        setSelectedPost('')
    }

    const handleProfilePictureBeforeUpload = (file) => {
        if(file.type.substring(0, file.type.indexOf('/'))!=='image'){
            message.error("You can only upload images")
            return false
        }
        else if(file.size>MAX_CONTENT_LEN){
            message.error("Single image cannot exceed 10MB")
            return false
        }
        else{
            return true
        }
    }

    const handleProfilePictureUpload = async ({file}) => {
        console.log("upload profile picture: ", file)
        try{
            const signed = await S3_GET_SIGNED_POST(file, 'ProfilePictures')
            await S3_UPLOAD_SINGLE_FILE(signed, file)
            message.success("Profile picture updated!")
            const newUser = {...user, profilePictureKey: `ProfilePictures/${file.uid}`}
            const res = await fetch(`http://localhost:8080/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newUser),
            })
    
            const data = await res.json()
    
            setUser({...user, profilePictureKey: data.profilePictureKey})
        }
        catch{
            message.error("Fail to update profile picture!")
        }
    }

    return (
        <div id="profile-container" style={profileContainerStyle}>
            <Sider
                style={profileSideBarStyle}
                // style={{float: "left"}}
                theme="light"
                width={sideBarWidth}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    if(broken){
                        setSideBarWidth("100%")
                    }
                    else{
                        setSideBarWidth("20%")
                    }
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <ImgCrop quality={1} modalTitle="Crop Your Profile Picture" modalOK="Confirm">
                    <Upload customRequest={handleProfilePictureUpload} beforeUpload={handleProfilePictureBeforeUpload} fileList={[]}>
                        <Tooltip title="Edit Profile Picture" placement="top" >
                            {
                                user.profilePictureKey===""?
                                <Avatar size="default" style={profilePictureStyle}>{`${user.firstName.substring(0,1)}${user.lastName.substring(0,1)}`}</Avatar>:
                                <Avatar size="default" src={profilePictureURL} style={profilePictureStyle} />
                            }
                            
                        </Tooltip>
                    </Upload>
                </ImgCrop>
                
                <div style={basicInfoStyle}>
                    Name: {user.firstName} {user.lastName}
                </div>
                <div style={basicInfoStyle}>
                    Email: {user.email.toLowerCase()}
                </div>
                <div style={basicInfoStyle}>
                    WeChat ID: {user.wechatID===""?"N/A":user.wechatID}
                </div>
                <div style={basicInfoStyle}>
                    Phone Number: {user.phoneNum===""?"N/A":user.phoneNum}
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
                        Edit Contact Info
                    </Menu.Item>
                </Menu>
            </Sider>
            
            <div id="profile-main-body" style={profileMainBodyStyle}>
                {
                    currentMenuKey==1?
                    <Cards posts={myPosts} displayMyPost={true} onClickDelete={onClickDelete} onClickEdit={onClickEdit} onClickCard={onClickCard}></Cards>:
                    currentMenuKey==2?
                    <Cards posts={mySavedPosts} displayMyPost={false} favoriteIDs={user.savedPosts} onClickStar={onClickStar}  onClickCard={onClickCard}></Cards>:
                    currentMenuKey==3?
                    <ChangePasswordPage user={user} setUser={setUser}/>:
                    <EditContactInfoPage user={user} setUser={setUser} />
                }
            </div>

            <Modal 
                title="Product Detail" 
                visible={isProductDetailVisible}
                onCancel={onCloseProductDetail}
                footer={null}
                width='70%'
            >
                <ProductDetailPage post={selectedPost} displayMyPost={currentMenuKey===1?true:false} onClickStar={onClickStar} isFavorite={user.savedPosts.includes(selectedPost.id)} onClickDelete={onClickDelete} onClickEdit={onClickEdit} user={selectedPostUserInfo}/>
            
                <Modal title="Delete Warning" visible={isDeleteModalVisible && isProductDetailVisible} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
                    <p>Are you sure you want to delete this post?</p>
                </Modal>
            
            </Modal>

            <Modal title="Delete Warning" visible={isDeleteModalVisible && !isProductDetailVisible} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
                <p>Are you sure you want to delete this post?</p>
            </Modal>

            {
                selectedPost.pictureKeyArray===undefined?
                '':
                <EditPostPage key={value} post={selectedPost} isEditPostVisible={isEditPostVisible} setIsEditPostVisible={setIsEditPostVisible} />  
            }
            
            



        </div>
    )
}

export default ProfilePage