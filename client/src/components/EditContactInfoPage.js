import React, { useState } from 'react'
import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
    message,
} from 'antd';
import axios from 'axios';

// const base_ = "http://localhost:3001";
const base_ = ""

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

    const onFinish = async () =>{
        const newUser = {wechatID: wechatID, phoneNum: phoneNum}

        axios.put(base_ + '/update-user-info', {newUser: newUser})
            .then(
                (res) => {
                    if(res.data.code===1){
                        message.error(`Fail to update the contact info: ${res.data.message}`)
                    }
                    else{
                        const data = res.data.data
                        if(data.wechatID===newUser.wechatID && data.phoneNum===newUser.phoneNum){
                            setUser({...user, wechatID: data.wechatID, phoneNum: data.phoneNum})
                            message.success('Successfully updated your contact info!')
                        }
                        else{
                            message.error('Update failed, please try again or contach a CSA IT department member!')
                        }
                    }
                }
            )
            .catch(
                (err) => {
                    console.log(err)
                    message.error('Fail to update the contact info.')
                }
            )

        

        

    }

    return (
        <div>
            <h1>Edit Contact Information</h1>

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
