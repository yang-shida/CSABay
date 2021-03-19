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

    const [wechatID, setWechatID] = useState('')
    const [phoneNum, setPhoneNum] = useState('')

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

        setUser({...user, wechatID: data.wechatID, phoneNum: data.phoneNum})

        setWechatID('')
        setPhoneNum('')

        form.resetFields();
    }



    return (
        <div>
            <h1>Edit Contact Information</h1>

            <Form
                form={form}
                {...formItemLayout}
                name="change-contact-info"
                onFinish={onFinish}
            >

                <Form.Item
                    name="wechat-id"
                    label="WeChat ID"
                >
                    <Input defaultValue={user.wechatID} value={wechatID} onChange={(e) => setWechatID(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                >
                    <Input defaultValue={user.phoneNum} value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)}/>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default EditContactInfoPage
