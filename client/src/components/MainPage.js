import { message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Cards from './Cards'

import ProductDetailPage from './ProductDetailPage'

const base_ = "http://localhost:3001";

const MainPage = ({isAuthenticated=false, user, setUser, routerProps}) => {

    const [posts, setPosts] = useState([])
    const [isProductDetailVisible, setIsProductDetailVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedPostUserInfo, setSelectedPostUserInfo] = useState('')

    useEffect(
        () => {
            let isSubscribed = true
            const getPosts = async()=>{
                axios.get(base_ + '/get-post-by-time?startIndex=0&numberOfPosts=20&order=new')
                    .then(
                        (res) => {
                            console.log(res)
                            if(res.data.code===1){
                                message.error(res.data.message)
                                if (isSubscribed){
                                    setPosts([])
                                }
                            }
                            else{
                                if (isSubscribed){
                                    setPosts(res.data.data)
                                }
                            }
                            
                        }
                    )
                    .catch(
                        (err) => {
                            console.log(err)
                            if (isSubscribed){
                                setPosts([])
                            }
                            message.error("Something went wrong")
                        }
                    )
                
            }

            getPosts()

            return (
                () => {
                    isSubscribed = false
                }
            )

        }, []
    )

    const addSavedPosts = async (postID) => {
        const updatedUser = {savedPosts: [...user.savedPosts, postID]}

        axios.put(base_ + '/update-user-info', {newUser: updatedUser})
            .then(
                (res) => {
                    if(res.data.code===1){
                        message.error(`Fail to update saved posts: ${res.data.message}`)
                    }
                    else{
                        setUser({...user, savedPosts: res.data.data.savedPosts})
                        message.success("Post saved!")
                    }
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    message.error('Fail to update saved posts.')
                }
            )
    }

    const deleteSavedPosts = async (postID) => {
        var updatedSavedPosts = user.savedPosts
        updatedSavedPosts.splice(user.savedPosts.indexOf(postID),1)
        const updatedUser = {savedPosts: updatedSavedPosts}

        axios.put(base_ + '/update-user-info', {newUser: updatedUser})
            .then(
                (res) => {
                    if(res.data.code===1){
                        message.error(`Fail to update saved posts: ${res.data.message}`)
                    }
                    else{
                        setUser({...user, savedPosts: res.data.data.savedPosts})
                        message.success("Post unsaved!")
                    }
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    message.error('Fail to update saved posts.')
                }
            )
    }

    const onClickStar = (postID) => {
        if(user.savedPosts.includes(postID)){
            deleteSavedPosts(postID)
        }
        else{
            addSavedPosts(postID)
        }
    }

    const onClickCard = async (post, e) => {
        setSelectedPost(post)
        setSelectedPostUserInfo(post.simplifiedUserInfo)
        setIsProductDetailVisible(true)
    }

    const onCloseProductDetail = () => {
        setIsProductDetailVisible(false)
        setSelectedPost('')
        setSelectedPost('')
    }

    return (
        <div>
            {
                posts.length===0?
                'There is no post now. Create the first one!':
                <Cards posts={posts} displayMyPost={false} favoriteIDs={isAuthenticated?user.savedPosts:[]} onClickStar={onClickStar} onClickCard={onClickCard} routerProps={routerProps} isAuth={isAuthenticated}></Cards>
            }

            <Modal 
                title="Product Detail" 
                visible={isProductDetailVisible}
                onCancel={onCloseProductDetail}
                footer={null}
                width='70%'
            >
                <ProductDetailPage post={selectedPost} displayMyPost={false} isFavorite={isAuthenticated?user.savedPosts.includes(selectedPost._id):false} onClickStar={onClickStar} user={selectedPostUserInfo} routerProps={routerProps} />
            </Modal>
            
        </div>
    )
}

export default MainPage
