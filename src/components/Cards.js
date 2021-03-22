import React from 'react'
import { Card, Col, Row, Avatar } from 'antd';
import { StarOutlined, DeleteOutlined, StarTwoTone, EditOutlined } from '@ant-design/icons';

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

const Cards = ({posts, onClickStar, favoriteIDs, displayMyPost, onClickDelete, onClickEdit, onClickCard}) => {

    return (
        <div>
            <Row>
                {
                    posts.map(
                        (post) => (
                            <Col key={post.id} style={{margin: '20px 15px'}}>
                                <Card
                                    hoverable={true}
                                    bordered={false}
                                    style={{width:widthOfCard}}
                                    actions={
                                        displayMyPost?
                                            [
                                                <EditOutlined key="edit-post" onClick={(e)=>{e.stopPropagation();onClickEdit(post.id);}} />,
                                                <DeleteOutlined key="delete-post" onClick={(e)=>{e.stopPropagation();onClickDelete(post.id);}} />
                                            ]
                                            :
                                            [
                                                favoriteIDs.includes(post.id)?
                                                <StarTwoTone key="favorite-post-yellow" twoToneColor="yellow" onClick={(e)=>{e.stopPropagation();onClickStar(post.id);}}/>:
                                                <StarOutlined key="favorite-post-gray" onClick={(e)=>{e.stopPropagation();onClickStar(post.id);}}/>
                                            ]
                                        
                                    }
                                    cover={
                                        <div style={{overflow: 'hidden', width: widthOfCard, height: widthOfCard, borderRadius: '10px'}}>
                                            <img
                                                style={{height: '100%', width: '100%', objectFit: 'cover'}}
                                                alt="example"
                                                src={post.pictures[post.cardPictureIndex]}
                                            />
                                        </div>
                                    }
                                    onClick={(e)=>onClickCard(post, e)}
                                >
                                    <div style={locationPriceContainerStyle}>
                                        <div style={priceStyle}>
                                            {`\$${post.price}`}
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
