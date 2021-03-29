import React, {useState, useEffect} from 'react'
import { Divider, Row, Col, Image } from 'antd';
import { StarOutlined, DeleteOutlined, StarTwoTone, EditOutlined } from '@ant-design/icons';

import ContactInfoCard from './ContactInfoCard'

import AWS from 'aws-sdk';

const config = {
    bucketName: 'csabayphotos',
    dirName: 'ProductDetailPhotos', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIA2SGQI5JKBX7R45YB',
    secretAccessKey: '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',
}

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

// title | actions
const headerContainerStyle = {
    // borderStyle: 'solid',
    // borderWidth: '2px',
    // borderColor: 'black',

    width: '100%',
    overflow: 'hidden'
}

const titleStyle = {
    fontSize: '20pt',
    fontWeight: '700',
    fontFamily: 'Arial, Helvetica, sans-serif',
    float: 'left'
}

const actionIconContainerStyle = {
    float: 'right'
}

const actionIconStyle = {
    fontSize: '30px',
    borderStyle: 'solid',
    borderColor: '#A0A0A0',
    borderWidth: '2px',
    borderRadius: '10px',
    margin: '3px',
    padding: '3px'
}

// contact info | images
const contactInfoLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 24,
    },
    md: {
        span: 24,
    },
    lg: {
        span: 8,
    }
}

const pictureWallLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 24,
    },
    md: {
        span: 24,
    },
    lg: {
        span: 16,
    }
}

// location, price, start date, end date | description
const otherInfoLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 24,
    },
    md: {
        span: 24,
    },
    lg: {
        span: 8,
    }
}

const descriptionLayout = {
    xs: {
        span: 24,
    },
    sm: {
        span: 24,
    },
    md: {
        span: 24,
    },
    lg: {
        span: 16,
    }
}

const otherInfoStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: 'black',
    textAlign: 'left',
    fontSize: '15pt',
    marginTop: '10px'
}

const headingTextStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 600,
    fontSize: '15pt',
    textAlign: 'center',
    marginBottom: '15px'
}


const dividerLayout = {
    span: 24
}



const ProductDetailPage = ({post, displayMyPost, isFavorite, onClickStar, user, onClickEdit, onClickDelete}) => {

    const S3_GET = (key) => {
        var S3 = new AWS.S3();
        var params = {Bucket: config.bucketName, Key: key, Expires: 60};
        var url = S3.getSignedUrl('getObject', params);
        console.log('The URL is', url);
        return url
    }

    return (
        <div>
            <div style={headerContainerStyle}>

                <div style={titleStyle}>
                    {post.title}
                </div>

                <div style={actionIconContainerStyle}>
                    {
                         displayMyPost?
                        (
                            [
                                <EditOutlined style={actionIconStyle} key="edit-post" onClick={()=>onClickEdit(post.id)} />,
                                <DeleteOutlined style={actionIconStyle} key="delete-post" onClick={()=>onClickDelete(post.id)} />
                            ]
                        ):
                        (
                            isFavorite?
                            <StarTwoTone style={actionIconStyle} key="favorite-post-yellow" twoToneColor="yellow" onClick={()=>onClickStar(post.id)}/>:
                            <StarOutlined style={actionIconStyle} key="favorite-post-gray" onClick={()=>onClickStar(post.id)}/>
                        )
                    }
                </div>

                <div style={{clear: 'both'}}></div>

            </div>
            
            <Row>
                <Col {...dividerLayout} >
                    <Divider orientation="left" style={{backgroundColor: '#E0E0E0', marginTop: '2px'}}>
                    </Divider>
                </Col>
            </Row>

            <Row gutter='16'>
                <Col {...contactInfoLayout}>
                    <ContactInfoCard user={user} isInfoVisible={true}/>
                </Col>
                <Col {...pictureWallLayout}>
                    <div style={headingTextStyle}>
                        Pictures
                    </div>
                    <Image.PreviewGroup>
                        {
                            post.pictureKeyArray.length===0?
                            <Image
                                width="250px"
                                height="250px"
                                style={{objectFit: 'contain', padding: '10px'}}
                                src='../no_image.jpg'
                            />:
                            post.pictureKeyArray.map(
                                (key, index) => (
                                    <Image
                                        key={index}
                                        width="250px"
                                        height="250px"
                                        style={{objectFit: 'contain', padding: '10px'}}
                                        src={S3_GET(key)}
                                    />
                                )
                            )
                        }
                    </Image.PreviewGroup>
                </Col>
            </Row>

            <Row>
                <Col {...dividerLayout} >
                    <Divider orientation="left" style={{backgroundColor: '#E0E0E0', marginTop: '2px'}}>
                    </Divider>
                </Col>
            </Row>

            {/* location, price, start date, end date | description */}
            <Row gutter='16'>
                <Col {...descriptionLayout}>
                    <div style={headingTextStyle}>
                        Detailed Description
                    </div>
                    <div style={otherInfoStyle}>
                        {post.description}
                    </div>
                </Col>

                <Col {...otherInfoLayout}>
                    <div style={otherInfoStyle}>
                        {`Location: ${post.zipcode===''?'N/A':post.zipcode}`}
                    </div>
                    <div style={otherInfoStyle}>
                        {`Price: \$ ${post.price===''?'N/A':post.price}`}
                    </div>
                    <div style={otherInfoStyle}>
                        {`Post start date: 3/1/2021`}
                    </div>
                    <div style={otherInfoStyle}>
                        {`Post end date: 4/1/2021`}
                    </div>
                </Col>
            </Row>

            

        </div>
    )
}

export default ProductDetailPage
