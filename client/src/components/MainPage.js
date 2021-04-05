import { message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import auth from '../auth/auth';

import Cards from './Cards'

import ProductDetailPage from './ProductDetailPage'



const MainPage = ({isAuthenticated=false, user, setUser, routerProps}) => {

    const [posts, setPosts] = useState([])
    const [isProductDetailVisible, setIsProductDetailVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedPostUserInfo, setSelectedPostUserInfo] = useState('')

    useEffect(
        () => {

            const getPosts = async()=>{
                const postsFromServer = await fetchPosts()
                setPosts(postsFromServer)
            }

            getPosts()

        }, []
    )

    const fetchUser = async(userID) =>{
        const res = await fetch(`http://localhost:8080/users?email=${userID.toLowerCase()}`)
        const data = await res.json()
        return data[0]
    }

    const fetchPosts = async () => {
        const res = await fetch('http://localhost:8080/posts1')
        const data = await res.json()
        
        return data
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

    const onClickCard = async (post, e) => {
        setSelectedPost(post)
        const userFromServer = await fetchUser(post.userID)
        setSelectedPostUserInfo(userFromServer)
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
                <ProductDetailPage post={selectedPost} displayMyPost={false} isFavorite={isAuthenticated?user.savedPosts.includes(selectedPost.id):false} onClickStar={onClickStar} user={selectedPostUserInfo} routerProps={routerProps} />
            </Modal>
            
        </div>
    )
}

export default MainPage
