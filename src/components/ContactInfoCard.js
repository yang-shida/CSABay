import React from 'react'
import { Card, Avatar } from 'antd';

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
    return (
        <div>
            <Card style={{ width: '100%', marginTop: 16 }} loading={!isInfoVisible} hoverable={true}>
                <div style={contactInfoHeadingTextStyle}>
                    Contact Information
                </div>
                <Avatar size="default" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={profilePictureStyle}/>
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
