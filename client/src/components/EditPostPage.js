import React, { useEffect, useState } from 'react';

import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
    Divider,
    InputNumber,
    Modal,
    message,
  } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';
import ImageUploader from './ImageUploader'
import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST, S3_DELETE_BY_KEY, S3_GET_OBJECT_TYPE} from './S3'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
                span: 24,
        },
        sm: {
                span: 12,
        },
    },
};

const dividerLayout = {
    xs: {
        span: 24
    },
    sm: {
        span: 20
    },
}

const EditPostPage = ({post, isEditPostVisible, setIsEditPostVisible}) => {

    const [fileList, setFileList] = useState([])

    useEffect(
        async () => {
            var array = []
            for(const key in post.pictureKeyArray){
                await S3_GET_OBJECT_TYPE(post.pictureKeyArray[key])
                    .then(
                        (type) => {
                            var temp = {
                                uid: post.pictureKeyArray[key].substring(post.pictureKeyArray[key].lastIndexOf('/')+1),
                                name: post.pictureKeyArray[key].substring(post.pictureKeyArray[key].lastIndexOf('/')+1),
                                status: 'done',
                                url: S3_GET(post.pictureKeyArray[key]),
                                type: type
                            }
                            array = [...array, temp]
                        }
                    )
                    .catch(
                        (err) => {
                            console.log(err)
                        }
                    )
            }
            setFileList(array)
        },[]
    )

    const [form] = Form.useForm();

    const [title, setTitle] = useState(post.title)
    const [description, setDescription] = useState(post.description)
    const [durationDays, setDurationDays] = useState(post.durationDays)
    const [zipcode, setZipcode] = useState(post.zipcode)
    const [price, setPrice] = useState(post.price)

    const [pictureKeyArray, setPictureKeyArray] = useState(post.pictureKeyArray)

    const originalPictureKeyArray = post.pictureKeyArray

    

    const [email, setEmail] = useState(post.email)
    const [wechatID, setWechatID] = useState(post.wechatID)
    const [phoneNum, setPhoneNum] = useState(post.phoneNum)

    const uploadAllPictures = () => {
        return new Promise(
            async (resolve, reject) => {
                try{
                    for(let index = 0; index < fileList.length; index ++){
                        const file = fileList[index]
                        if(!originalPictureKeyArray.includes(`ProductDetailPhotos/${file.uid}`)){
                            const signed = await S3_GET_SIGNED_POST(file, 'ProductDetailPhotos')
                            await S3_UPLOAD(signed, fileList, index)
                        }
                    }
                    resolve()
                }
                catch{
                    reject()
                }
            }
        )
    }

    const deleteAllOldPictures = () => {
        return new Promise(
            async (resolve, reject) => {
                for(const key in originalPictureKeyArray){
                    await S3_DELETE_BY_KEY(originalPictureKeyArray[key])
                }
                resolve()
            }
        )
    }

    const onFinish = async () => {
        message.loading({content: "Uploading Pictures", key: "updatable"})
        await uploadAllPictures()
            .then(
                async () => {
                    const updatedPost = {
                        ...post,
                        title: title,
                        description: description,
                        durationDays: durationDays,
                        zipcode: zipcode,
                        price: price,
                        pictureKeyArray: pictureKeyArray,
                        email: email.toLowerCase(),
                        wechatID: wechatID.toLowerCase(),
                        phoneNum: phoneNum
                    }

                    const res = await fetch(`http://localhost:8080/posts1/${post.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(updatedPost),
                    })

                    message.success({content: "Post updated!", key: "updatable", duration: 2})

                    // setIsEditPostVisible(false)
                }
            )
            .catch(
                () => {
                    message.error({content: "Fail to update pictures", key: "updatable", duration: 2})
                }
            )
        

        
    }

    const onCloseEditPost = () => {
        setIsEditPostVisible(false)
    }

    return (
        <div>
            <Modal 
                title="Edit Post" 
                visible={isEditPostVisible}
                onCancel={onCloseEditPost}
                footer={null}
                width='70%'
            >
                <Form
                    form={form}
                    {...formItemLayout}
                    name="createPost"
                    onFinish={onFinish}
                    initialValues={{
                        ["title"]: post.title,
                        ["description"]: post.description,
                        ["duration"]: post.durationDays,
                        ["zipcode"]: post.zipcode,
                        ["price"]: post.price,
                        ["email"]: post.email,
                        ["wechat-id"]: post.wechatID,
                        ["phone"]: post.phoneNum
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
                            <ImageUploader maxNumberOfPictures='9' pictureKeyArray={pictureKeyArray} setPictureKeyArray={setPictureKeyArray} fileList={fileList} setFileList={setFileList}></ImageUploader>
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
                
                    <Row justify='center'>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Update Post
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </div>
    )
}

export default EditPostPage