import React, {useEffect, useState} from 'react'
import { Card, Avatar } from 'antd';
import {S3_GET} from './S3'
import default_profile_pic from '../img/default_profile_pic.jpg'
import please_log_in from '../img/please_log_in.png'

const profilePictureStyle = {
    width: '90%',
    height: 'auto',
    marginLeft: '5%',

    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#E0E0E0',
    marginBottom: '10px'
}

const contactInfoHeadingTextStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 600,
    fontSize: '15pt',
    textAlign: 'center',
    marginBottom: '15px'
}

const contactInfoStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#A0A0A0',
    textAlign: 'left',
    fontSize: '15pt',
    marginTop: '10px'
}

const ContactInfoCard = ({user, post, isInfoVisible}) => {

    const [profilePictureURL, setProfilePictureURL] = useState("")

    useEffect(
        () => {
            if(user.profilePictureKey !== ""){
                S3_GET(user.profilePictureKey)
                    .then(
                        (url) => {
                            setProfilePictureURL(url)
                        }
                    )
            }
        }, [user]
    )

    return (
        <div>
            <Card style={{ width: '100%', marginTop: 16 }} hoverable={true}>
                <div style={contactInfoHeadingTextStyle}>
                    Contact Information
                </div>
                {
                    (!isInfoVisible)?
                    <Avatar size="default" src={please_log_in} style={profilePictureStyle} />:
                    user.profilePictureKey===""?
                    <Avatar size="default" src={default_profile_pic} style={profilePictureStyle} />:
                    <Avatar size="default" src={profilePictureURL} style={profilePictureStyle} />
                }
                <div style={contactInfoStyle}>
                    Name: {user.firstName} {user.lastName}
                </div>
                <div style={contactInfoStyle}>
                    {`Email: ${post.email===''?'N/A':post.email}`}
                </div>
                <div style={contactInfoStyle}>
                    {`WeChat ID: ${post.wechatID===''?'N/A':post.wechatID}`}
                </div>
                <div style={contactInfoStyle}>
                    {`Phone Number: ${post.phoneNum===''?'N/A':post.phoneNum}`}
                </div>
            </Card>
        </div>
    )
}

export default ContactInfoCard
