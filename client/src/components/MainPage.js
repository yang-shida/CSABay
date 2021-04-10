import { message, Modal, Select, Row, Col, Divider } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Cards from './Cards'

import ProductDetailPage from './ProductDetailPage'

// const base_ = "http://localhost:3001";
const base_ = ""

const { Option } = Select;

const filterSorterLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 9,
    },
    md: {
        span: 7,
    },
    lg: {
        span: 6,
    },
    xl: {
        span: 5,
    },
}

const typeTextLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 4,
    },
    md: {
        span: 3,
    },
    lg: {
        span: 3,
    },
    xl: {
        span: 2
    }
}

const sortTextLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 2,
    },
    md: {
        span: 1,
    },
}

const MainPage = ({isAuthenticated=false, user, setUser, routerProps}) => {

    const [posts, setPosts] = useState([])
    const [isProductDetailVisible, setIsProductDetailVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedPostUserInfo, setSelectedPostUserInfo] = useState('')

    const [disableFilterSorter, setDisableFilterSorter] = useState(false)
    const [typeFilter, setTypeFilter] = useState('All')
    const [sortState, setSortState] = useState('time-new')

    useEffect(
        () => {
            let isSubscribed = true
            const getPosts = async()=>{
                message.loading({content: "Loading posts", key: "updatable", duration: 0})
                axios.get(base_ + '/api/get-post-by-time?startIndex=0&numberOfPosts=100&order=new')
                    .then(
                        (res) => {
                            if(res.data.code===1){
                                message.error(res.data.message)
                                if (isSubscribed){
                                    setPosts([])
                                    message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
                                }
                            }
                            else{
                                if (isSubscribed){
                                    setPosts(res.data.data)
                                    message.success({content: 'Posts loaded', key: "updatable", duration: 2})
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
                            message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
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

        axios.put(base_ + '/api/update-user-info', {newUser: updatedUser})
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

        axios.put(base_ + '/api/update-user-info', {newUser: updatedUser})
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

    const handleTypeChange = (value) => {
        setTypeFilter(value)
        message.loading({content: "Loading posts", key: "updatable", duration: 0})
        setDisableFilterSorter(true)
        axios.get(base_ + `/api/${sortState.includes('time')?'get-post-by-time':'get-post-by-price'}?${value=='All'?'':`typeOfPost=${value}&`}startIndex=0&numberOfPosts=100&order=${sortState.substr(sortState.lastIndexOf('-')+1)}`)
            .then(
                (res) => {
                    console.log(res)
                    if(res.data.code===1){
                        message.error(res.data.message)
                        setPosts([])
                        message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
                        setDisableFilterSorter(false)
                    }
                    else{
                        setPosts(res.data.data)
                        message.success({content: 'Posts loaded', key: "updatable", duration: 2})
                        setDisableFilterSorter(false)
                    }
                    
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    setPosts([])
                    message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
                    setDisableFilterSorter(false)
                }
            )

    }

    const handleSorterChange = (value) => {
        setSortState(value)
        message.loading({content: "Loading posts", key: "updatable", duration: 0})
        setDisableFilterSorter(true)
        axios.get(base_ + `/api/${value.includes('time')?'get-post-by-time':'get-post-by-price'}?${typeFilter=='All'?'':`typeOfPost=${typeFilter}&`}startIndex=0&numberOfPosts=100&order=${value.substr(value.lastIndexOf('-')+1)}`)
            .then(
                (res) => {
                    console.log(res)
                    if(res.data.code===1){
                        message.error(res.data.message)
                        setPosts([])
                        message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
                        setDisableFilterSorter(false)
                    }
                    else{
                        setPosts(res.data.data)
                        message.success({content: 'Posts loaded', key: "updatable", duration: 2})
                        setDisableFilterSorter(false)
                    }
                    
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    setPosts([])
                    message.error({content: 'Fail to load posts', key: "updatable", duration: 2})
                    setDisableFilterSorter(false)
                }
            )
    }

    return (
        <div>

            <Row style={{marginTop: '30px'}} gutter={16}>
                <Col {...typeTextLayout}>
                    Type of Post:
                </Col>

                <Col {...filterSorterLayout}>
                    <Select style={{ width: '100%' }} onChange={handleTypeChange} defaultValue='All' disabled={disableFilterSorter}>
                        <Option value="All">All</Option>
                        <Option value="Selling">Selling</Option>
                        <Option value="Buying">Buying</Option>
                        <Option value="Subleasing">Subleasing</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Col>

                <Col {...sortTextLayout}>
                    Sort:
                </Col>

                <Col {...filterSorterLayout}>
                    <Select style={{ width: '100%' }} onChange={handleSorterChange} defaultValue='time-new' disabled={disableFilterSorter}>
                        <Option value="time-new">Post time: from new to old</Option>
                        <Option value="time-old">Post time: from old to new</Option>
                        <Option value="price-high">Price: from high to low</Option>
                        <Option value="price-low">Price: from low to high</Option>
                    </Select>
                </Col>
            </Row>

            <Divider></Divider>

            

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
                <ProductDetailPage post={selectedPost} displayMyPost={false} isFavorite={isAuthenticated?user.savedPosts.includes(selectedPost._id):false} onClickStar={onClickStar} user={selectedPostUserInfo} routerProps={routerProps} isAuth={isAuthenticated} />
            </Modal>
            
        </div>
    )
}

export default MainPage
