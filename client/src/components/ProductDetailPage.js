import React, {useState, useEffect} from 'react'
import { Divider, Row, Col, Image, Popconfirm, Button } from 'antd';
import { StarOutlined, DeleteOutlined, StarTwoTone, EditOutlined } from '@ant-design/icons';

import ContactInfoCard from './ContactInfoCard'

import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST} from './S3'
import no_image from '../img/no_image.jpg'
import auth from '../auth/auth';

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



const ProductDetailPage = ({post, displayMyPost, isFavorite, onClickStar, user, onClickEdit, onClickDelete, routerProps, isAuth}) => {

    const onConfirmToLogin = () => {
        routerProps.history.push('./login')
    }

    const [pictureUrlArray, setPictureUrlArray] = useState([])
    

    useEffect(
        async () => {
            if(post.pictureKeyArray.length === 0){
                setPictureUrlArray([])
            }
            else{
                setPictureUrlArray([])
                for(const key in post.pictureKeyArray){
                    const currentKey = post.pictureKeyArray[key]
                    await S3_GET(currentKey).then(
                        (url) => {
                            setPictureUrlArray(prevState=>([...prevState, url]))
                        }
                    )
                }
            }
            
        }, [post]
    )

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
                                <EditOutlined style={actionIconStyle} key="edit-post" onClick={()=>onClickEdit(post)} />,
                                <DeleteOutlined style={actionIconStyle} key="delete-post" onClick={()=>onClickDelete(post._id)} />
                            ]
                        ):
                        (
                            isFavorite?
                            <StarTwoTone style={actionIconStyle} key="favorite-post-yellow" twoToneColor="yellow" onClick={()=>onClickStar(post._id)}/>:
                            isAuth?
                            <StarOutlined style={actionIconStyle} key="favorite-post-gray" onClick={()=>onClickStar(post._id)}/>:
                            <Popconfirm
                                title="You need to login to favorite a post. Do you want to login?"
                                onConfirm={onConfirmToLogin}
                                okText="Yes"
                                cancelText="No"
                            >
                                <StarOutlined style={actionIconStyle} key="favorite-post-gray" />
                            </Popconfirm>
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
                    {
                        isAuth?
                        <ContactInfoCard user={user} post={post} isInfoVisible={true}/>:
                        <Popconfirm
                            title="You need to login to see the contact info. Do you want to login?"
                            onConfirm={onConfirmToLogin}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{width: '100%', height: '100%', borderColor: 'transparent'}}>
                                <ContactInfoCard user={user} post={post} isInfoVisible={true}/>
                            </Button>
                        </Popconfirm>
                    }
                </Col>
                <Col {...pictureWallLayout}>
                    <div style={headingTextStyle}>
                        Pictures
                    </div>
                    <Image.PreviewGroup>
                        {
                            pictureUrlArray.length===0?
                            <Image
                                width="250px"
                                height="250px"
                                style={{objectFit: 'contain', padding: '10px'}}
                                src={no_image}
                            />:
                            pictureUrlArray.map(
                                (url, index) => (
                                    <Image
                                        key={index}
                                        width="250px"
                                        height="250px"
                                        style={{objectFit: 'contain', padding: '10px'}}
                                        src={url}
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
                        {`Type of post: ${post.typeOfPost}`}
                    </div>
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
