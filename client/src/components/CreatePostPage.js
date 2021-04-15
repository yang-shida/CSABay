import React, { useState } from 'react';
import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST} from './S3'

import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
    Divider,
    InputNumber,
    message,
    Select,
  } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';
import ImageUploader from './ImageUploader'
import axios from 'axios';

// const base_ = "http://localhost:3001";
const base_ = ""

const { Option } = Select;

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

const CreatePostPage = ({user}) => {
    const [form] = Form.useForm();

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [durationDays, setDurationDays] = useState(30)
    const [typeOfPost, setTypeOfPost] = useState('')

    const [zipcode, setZipcode] = useState('')
    const [price, setPrice] = useState(0)

    const [pictureKeyArray, setPictureKeyArray] = useState([])
    const [fileList, setFileList] = useState([])

    const [email, setEmail] = useState(user.email)
    const [wechatID, setWechatID] = useState(user.wechatID)
    const [phoneNum, setPhoneNum] = useState(user.phoneNum)

    const [value, setValue] = useState(0)

    const uploadAllPictures = () => {
        return new Promise(
            async (resolve, reject) => {
                var count = fileList.length
                for(let index = 0; index < fileList.length; index ++){
                    const file = fileList[index]
                    try{
                        const signed = await S3_GET_SIGNED_POST(file, 'ProductDetailPhotos')
                        await S3_UPLOAD(signed, fileList, index)
                        count--
                        if(count===0){
                            resolve()
                        }
                        
                    }
                    catch{
                        reject()
                    }
                }
                if(count===0){
                    resolve()
                }
            }
        )
    }

    const onFinish = async () => {

        message.loading({content: "Uploading Pictures", key: "uploadPicMessage", duration: 0})
        await uploadAllPictures()
            .then(
                async () => {
                    const newPost = {
                        title: title,
                        description: description,
                        durationDays: durationDays,
                        typeOfPost: typeOfPost,
                        zipcode: zipcode,
                        price: price,
                        pictureKeyArray: pictureKeyArray,
                        email: email.toLowerCase(),
                        wechatID: wechatID.toLowerCase(),
                        phoneNum: phoneNum
                    }

                    axios.post(base_ + '/api/add-post', {newPost: newPost})
                        .then(
                            (res) => {
                                if(res.data.code===1){
                                    message.error({content: `Fail to create post: ${res.data.message}`, key: "uploadPicMessage", duration: 2})
                                }
                                else{
                                    setTitle('')
                                    setDescription('')
                                    setDurationDays(30)
                                    setTypeOfPost('')
                                    setZipcode('')
                                    setPrice(0)
                                    setPictureKeyArray([])
                                    setFileList([])
                                    setEmail(user.email)
                                    setWechatID(user.wechatID)
                                    setPhoneNum(user.phoneNum)
                            
                                    form.resetFields();

                                    message.success({content: "Post Created!", key: "uploadPicMessage", duration: 2})
                                }
                            }
                        )
                        .catch(
                            (err) => {
                                console.log(err)
                                message.error({content: "Fail to create post", key: "uploadPicMessage", duration: 2})
                            }
                        )
            
                    
                }
            )
            .catch(
                () => {
                    message.error({content: "Fail to upload pictures", key: "uploadPicMessage", duration: 2})
                }
            )


    }

    const handleChange = (value) => {
        setTypeOfPost(value)
        form.setFieldsValue({"type-of-post": value})
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
                    "duration": 30,
                    "email": user.email,
                    "wechat-id": user.wechatID,
                    "phone": user.phoneNum,
                    "price": price
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
                    label="Post Description"
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
                            <Tooltip title="Enter how many days you expect your post to stay active. The maximum duration is 30 days. After these many days, your post will be automatically deleted. You can renew the duration after posting by editing and re-uploading your post if you need to post longer.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    } 
                    rules={
                        [
                            {
                                type: 'number', 
                                min: 7, 
                                max: 30, 
                                message: 'Duration needs to be a number between 7 and 30!'
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

                <Form.Item
                    name= "type-of-post"
                    label="Type of Your Post"
                    hasFeedback
                    rules={
                        [
                            {
                                required: true,
                                message: 'Please select the post type!',
                            },
                        ]
                    }
                >
                    <Row justify='start'>
                        <Col>
                            <Select style={{ width: 200 }} onChange={handleChange}>
                                <Option value="Selling">Selling</Option>
                                <Option value="Buying">Buying</Option>
                                <Option value="Subleasing">Subleasing</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Col>
                    </Row>
                    
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
                        formatter={
                            value => {
                                return (value==0?
                                "$ 0":
                                `$ ${value}`)
                            }
                        }
                        style={{ width: '100%' }}
                        value={price} 
                        onChange={
                            (value) => {
                                if(value==null){
                                    setPrice(0)
                                }
                                else{
                                    setPrice(value)
                                }
                                
                            }
                        }
                        placeholder="$ 0"
                    />
                </Form.Item>

                <Form.Item
                    name="pictures"
                    label={
                        <span>
                            Pictures&nbsp;
                            <Tooltip title="The first picture will be used as the cover picture.">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                >
                    <div style={{borderWidth: '1px', borderColor: '#E0E0E0', borderStyle: 'solid', padding: '40px'}}>
                        <ImageUploader key={value} maxNumberOfPictures='9' pictureKeyArray={pictureKeyArray} setPictureKeyArray={setPictureKeyArray} fileList={[...fileList]} setFileList={setFileList}></ImageUploader>
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

export default CreatePostPage
