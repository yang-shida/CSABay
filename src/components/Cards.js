import React from 'react'
import { Card, Col, Row, Avatar } from 'antd';
import { StarOutlined } from '@ant-design/icons';

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

const Cards = ({posts}) => {
    return (
        <div>
            <Row>
                {
                    posts.map(
                        (post) => (
                            <Col style={{margin: '20px 15px'}}>
                                <Card
                                    hoverable={true}
                                    bordered={false}
                                    key={post.id}
                                    style={{width:widthOfCard}}
                                    actions={[
                                        <StarOutlined key="favorite" />,
                                    ]}
                                    cover={
                                        <div style={{overflow: 'hidden', width: widthOfCard, height: widthOfCard, borderRadius: '10px'}}>
                                            <img
                                                style={{height: '100%', width: '100%', objectFit: 'cover'}}
                                                alt="example"
                                                src={post.pictures[post.cardPictureIndex]}
                                            />
                                        </div>
                                    }
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
