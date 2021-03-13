import { Card, Col, Row, Avatar } from 'antd';
import { useEffect, useState } from 'react';

import Cards from './Cards'



const MainPage = () => {

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

    return (
        <div>
            {
                posts.length===0?
                'No posts':
                <Cards posts={posts}></Cards>
            }
            
        </div>
    )
}

export default MainPage
