import { Card, Col, Row, Avatar } from 'antd';
import { useEffect, useState } from 'react';

import Cards from './Cards'



const MainPage = ({user, setUser}) => {

    const [posts, setPosts] = useState([])

    useEffect(
        () => {

            const getPosts = async()=>{
                const postsFromServer = await fetchPosts()
                setPosts(postsFromServer)
            }

            getPosts()

        }, []
    )

    const fetchPosts = async () => {
        const res = await fetch('http://localhost:8080/posts')
        const data = await res.json()
        
        return data
    }

    const addSavedPosts = async (postID) => {
        console.log("Adding saved post id: ", postID)
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
        console.log("Deleting saved post id: ", postID)
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

    return (
        <div>
            {
                posts.length===0?
                'No posts':
                <Cards posts={posts} favoriteIDs={user.savedPosts} onClickStar={onClickStar}></Cards>
            }
            
        </div>
    )
}

export default MainPage
