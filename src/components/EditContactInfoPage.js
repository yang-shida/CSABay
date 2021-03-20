import React, { useState } from 'react'
import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
} from 'antd';

const formItemLayout = {
    labelCol: {
        sm: {
            span: 24,
        },
        sm: {
            span: 24,
        },
        md: {
            span: 24,
        },
        lg: {
            span: 6,
        },
    },
    wrapperCol: {
        sm: {
            span: 24,
        },
        sm: {
            span: 24,
        },
        md: {
            span: 24,
        },
        lg: {
            span: 12,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        md: {
            span: 24,
        },
        lg: {
            span: 24, 
        },
    },
}

const EditContactInfoPage = ({user, setUser}) => {

    const [form] = Form.useForm();

    const [wechatID, setWechatID] = useState(user.wechatID)
    const [phoneNum, setPhoneNum] = useState(user.phoneNum)

    const [warningMessage, setWarningMessage] = useState('')

    const onFinish = async () =>{
        const newUser = {...user, wechatID: wechatID, phoneNum: phoneNum}

        const res = await fetch(`http://localhost:8080/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newUser),
        })

        const data = await res.json()

        if(data.wechatID===newUser.wechatID && data.phoneNum===newUser.phoneNum){
            setUser({...user, wechatID: data.wechatID, phoneNum: data.phoneNum})
            setWarningMessage('Successfully updated your contact info!')
        }
        else{
            setWarningMessage('Update failed, please try again or contach a CSA IT department member!')
        }

        

    }

    const warningStyle = {
        color: `${warningMessage==='Successfully updated your contact info!'?'green':'red'}`,
        display: `${warningMessage===''?'none':'block'}`,
        marginBottom: '5px'
    }

    return (
        <div>
            <h1>Edit Contact Information</h1>
            <div style={warningStyle}>
                {warningMessage}
            </div>

            <Form
                form={form}
                {...formItemLayout}
                name="change-contact-info"
                onFinish={onFinish}
                initialValues={{
                    ["wechat-id"]: user.wechatID,
                    ["phone"]: user.phoneNum
                }}
            >

                <Form.Item
                    name="wechat-id"
                    label="WeChat ID"
                >
                    <Input value={wechatID} onChange={(e) => setWechatID(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                >
                    <Input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)}/>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default EditContactInfoPage
