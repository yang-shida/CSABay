import React, {useState, useEffect} from 'react'
import { Card, Col, Row, Avatar, Popconfirm } from 'antd';
import { StarOutlined, DeleteOutlined, StarTwoTone, EditOutlined } from '@ant-design/icons';
import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST} from './S3'
import auth from '../auth/auth';
import { CostExplorer } from 'aws-sdk';

const { Meta } = Card;

const widthOfCard = '300px';

const locationPriceContainerStyle = {
    width: '250px',
    height: '40px',
    position: 'relative',
    marginBottom: '10px'
};

const locationStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translate(-100%, -50%)',
    textAlign: 'Right', 
    fontSize: '10pt',
    float: 'right'
};

const priceStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    position: 'absolute',
    top: '50%',
    left: '0%',
    transform: 'translate(0%, -50%)',
    textAlign: 'Left', 
    fontSize: '18pt', 
    fontWeight: '700',
    float: 'left'
};

const Cards = ({posts, onClickStar, favoriteIDs, displayMyPost, onClickDelete, onClickEdit, onClickCard, routerProps, isAuth}) => {

    const onConfirmToLogin = () => {
        routerProps.history.push('./login')
    }

    const [postsWithCoverUrl, setPostsWithCoverUrl] = useState([])

    useEffect(
        async () => {
            let isSubscribed = true
            var temp = []
            for(const post in posts){
                const currentPost = posts[post]
                if(posts[post].pictureKeyArray.length>0){
                    await S3_GET(posts[post].pictureKeyArray[0]).then(
                        (url) => {
                            temp = [...temp, {...currentPost, coverUrl: url}]
                        }
                    )
                }
                else{
                    temp = [...temp, {...currentPost, coverUrl: ''}]
                }
            }
            if(isSubscribed){
                setPostsWithCoverUrl(temp)
            }
            
            return (
                () => {
                    isSubscribed = false
                }
            )
        }, [posts]
    )

    return (
        <div>
            <Row>
                {
                    postsWithCoverUrl.map(
                        (post) => (
                            <Col key={post.id} style={{margin: '20px 15px'}}>
                                <Card
                                    hoverable={true}
                                    bordered={false}
                                    style={{width:widthOfCard}}
                                    actions={
                                        displayMyPost?
                                            [
                                                <EditOutlined key="edit-post" onClick={(e)=>{e.stopPropagation();onClickEdit(post);}} />,
                                                <DeleteOutlined key="delete-post" onClick={(e)=>{e.stopPropagation();onClickDelete(post.id);}} />
                                            ]
                                            :
                                            [
                                                favoriteIDs.includes(post.id)?
                                                <StarTwoTone key="favorite-post-yellow" twoToneColor="yellow" onClick={(e)=>{e.stopPropagation();onClickStar(post.id);}}/>:
                                                isAuth?
                                                <StarOutlined key="favorite-post-gray" onClick={(e)=>{e.stopPropagation();onClickStar(post.id);}}/>:
                                                <Popconfirm
                                                    title="You need to login to favorite a post. Do you want to login?"
                                                    onConfirm={(e) => {e.stopPropagation(); onConfirmToLogin()}}
                                                    onCancel={(e)=>{e.stopPropagation();}}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <StarOutlined key="favorite-post-gray" onClick={(e)=>{e.stopPropagation();}}/>
                                                </Popconfirm>
                                            ]
                                        
                                    }
                                    cover={
                                        <div style={{overflow: 'hidden', width: widthOfCard, height: widthOfCard, borderRadius: '10px'}}>
                                            <img
                                                style={{height: '100%', width: '100%', objectFit: 'cover'}}
                                                alt="example"
                                                src={post.pictureKeyArray.length===0?'../no_image.jpg':post.coverUrl}
                                            />
                                        </div>
                                    }
                                    onClick={(e)=>onClickCard(post, e)}
                                >
                                    <div style={locationPriceContainerStyle}>
                                        <div style={priceStyle}>
                                            {`\$${post.price?post.price:' N/A'}`}
                                        </div>
                                        <div style={locationStyle}>
                                            {'Gainesville, FL 32607'}
                                        </div>
                                    </div>
                                    <div style={{clear: 'both'}}></div>
                                    <Meta
                                        style={{marginLeft: '0px'}}
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={post.title}
                                        description={'5 days ago'}
                                    />
                                </Card>
                            </Col>
                        )
                    )
                }
            </Row>
        </div>
    )
}

export default Cards
