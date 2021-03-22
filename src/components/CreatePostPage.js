import React, { useState } from 'react';

import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
    Divider,
    InputNumber,
  } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';
import ImageUploader from './ImageUploader'


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
                span: 24,
        },
        sm: {
                span: 8,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24, 
        },
    },
}

const dividerLayout = {
    xs: {
        span: 24
    },
    sm: {
        span: 12
    },
}

const CreatPostPage = ({user}) => {
    const [form] = Form.useForm();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [durationDays, setDurationDays] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [price, setPrice] = useState('')

    const [email, setEmail] = useState(user.email)
    const [wechatID, setWechatID] = useState(user.wechatID)
    const [phoneNum, setPhoneNum] = useState(user.phoneNum)

    const onFinish = async () => {
        const newPost = {
            title: title,
            description: description,
            durationDays: durationDays,
            zipcode: zipcode,
            price: price,
            email: email,
            wechatID: wechatID,
            phoneNum: phoneNum
        }

        const res = await fetch('http://localhost:8080/posts1', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newPost),
        })

        setTitle('')
        setDescription('')
        setDurationDays('')
        setZipcode('')
        setPrice('')
        setEmail(user.email)
        setWechatID(user.wechatID)
        setPhoneNum(user.phoneNum)

        form.resetFields();
    }

    return (
        <div>
            <h1>Create Post</h1>
            <Form
                form={form}
                {...formItemLayout}
                name="createPost"
                onFinish={onFinish}
                initialValues={{
                    ["email"]: user.email,
                    ["wechat-id"]: user.wechatID,
                    ["phone"]: user.phoneNum
                }}
            >

                <Row justify='center'>
                    <Col {...dividerLayout}>
                        <Divider orientation="left">
                            General Post Information&nbsp;
                            <Tooltip title="Enter the basic post informtion. These fields are required.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </Divider>
                    </Col>
                </Row>

                <Form.Item
                    name="title"
                    label="Post Title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the post title!',
                        },
                    ]
                    }
                >
                    <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Post Desceiption"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the post descroption!',
                        },
                    ]
                    }
                >
                    <Input.TextArea value={description} rows={4} onChange={(e) => setDescription(e.target.value)}/>
                </Form.Item>

                <Form.Item 
                    name="duration"
                    label={
                        <span>
                            Post Duration (Days)&nbsp;
                            <Tooltip title="Enter how many days you expect your post to stay active. The maximum duration is 30 days. After these many days, your post will be automatically deleted. You can renew the duration after posting if you need to post longer.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    } 
                    rules={
                        [
                            {
                                type: 'number', 
                                min: 1, 
                                max: 30, 
                                message: 'Duration needs to be a number between 1 and 30!'
                            },
                            {
                                required: true,
                                message: 'Please input the duration of your post!',
                            },
                        ]
                    }
                >
                    <InputNumber placeholder="Enter a number between 1 and 30, see question mark for more detail" value={durationDays} onChange={(value) => setDurationDays(value)} style={{ width: '100%' }}/>
                </Form.Item>

                <Row justify='center'>
                    <Col {...dividerLayout}>
                        <Divider orientation="left">
                            Additional Post Information&nbsp;
                            <Tooltip title="Enter addition post information to give more details about your post.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </Divider>
                    </Col>
                </Row>

                <Form.Item
                    name="zipcode"
                    label={
                        <span>
                            ZIP Code&nbsp;
                            <Tooltip title="Other users can use the ZIP Code to see the approximate location of the post.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={
                        [
                            ()=>({
                                validator(_, value){
                                    if(value==='' || value===undefined){
                                        return Promise.resolve();
                                    }
                                    else if(!(/^\d{5}(-\d{4})?$/.test(value))){
                                        return Promise.reject('Please enter a valid US ZIP Code!');
                                    }
                                    else{
                                        return Promise.resolve();
                                    }
                                }
                            })
                        ]
                    }
                >
                    <Input value={zipcode} onChange={(e) => setZipcode(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={
                        [
                            {
                                type: 'number',
                                message: 'Price needs to be a number!'
                            }
                            
                        ]
                    }
                >
                    <InputNumber 
                        formatter={value => `$ ${value}`}
                        style={{ width: '100%' }}
                        value={price} 
                        onChange={(value) => setPrice(value)}
                    />
                </Form.Item>

                <Form.Item
                    name="pictures"
                    label="Pictures"
                >
                    <div style={{borderWidth: '1px', borderColor: '#E0E0E0', borderStyle: 'solid', padding: '40px'}}>
                        <ImageUploader maxNumberOfPictures='9'></ImageUploader>
                    </div>
                </Form.Item>

                <Row justify='center'>
                    <Col {...dividerLayout}>
                        <Divider orientation="left">
                            Contact Information&nbsp;
                            <Tooltip title="Enter your contact information here so that they are only visible to logged-in users. If you put your contact information in the description, it would be visible to everyone.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </Divider>
                    </Col>
                </Row>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'Please input a valid E-mail!'
                        },
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Item>

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
                        Create Post
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default CreatPostPage
