import React, { useState } from 'react'

import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
  } from 'antd';
import {PasswordInput} from 'antd-password-input-strength'
import { QuestionCircleOutlined } from '@ant-design/icons';

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

const ChangePasswordPage = ({user, setUser}) => {

    const [form] = Form.useForm();

    const [emailVerification, setEmailVerification] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const [warningMessage, setWarningMessage] = useState('')

    const onFinish = async () =>{
        if(oldPassword !== user.password){
            setWarningMessage('Your old password is incorrect.')
        }
        else if(false /*check email verification*/){
            setWarningMessage('Your email verification code is incorrect.')
        }
        else{
            const newUser = {...user, password: password}

            const res = await fetch(`http://localhost:8080/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newUser),
            })
    
            const data = await res.json()
    
            setUser({...user, password: data.password})

            setEmailVerification('')
            setOldPassword('')
            setPassword('')
            setConfirm('')
            setWarningMessage('')
    
            form.resetFields();
        }


    }

    const warningStyle = {
        color: 'red',
        display: `${warningMessage===''?'none':'block'}`,
        marginBottom: '5px'
    }


    return (
        <div>
            <h1>Change Password</h1>
            <div style={warningStyle}>
                {warningMessage}
            </div>
            <Form
                form={form}
                {...formItemLayout}
                name="change-password"
                onFinish={onFinish}
            >

                <Form.Item label="* Email Verification Code" >
                    <Row gutter={6}>
                        <Col span={20}>
                            <Form.Item
                                name='code'
                                noStyle						
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input the email verification code you got!'
                                    }
                                ]}
                            >
                                <Input placeholder="Enter your email verification code" value={emailVerification} onChange={(e) => setEmailVerification(e.target.value)}/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            {/* TODO: add onClick action to check if match database */}
                            <Button>    
                                Get Code
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    name="old-password"
                    label="Old Password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your old password!',
                        }
                    ]}
                >
                    <Input.Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </Form.Item>

                <Form.Item 
                    label={
                        <span>
                            New Password&nbsp;
                            <Tooltip title="Password should be at least 6 characters long. You should include numbers, upper-case letters, and lower-case letters in your password.">
                            <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your new password!',
                        },
                        () => ({
                            validator(_, value) {
                                let hasNum = /\d/.test(value);
                                let hasUpper = /[A-Z]/.test(value);
                                let hasLower = /[a-z]/.test(value);
                                let hasSpace = / /.test(value)
                                if(hasSpace){
                                    return Promise.reject('Password cannot contain space!');
                                }
                                else if (value.length < 6) {
                                    return Promise.reject('Password should be at least 6 characters long!');
                                }
                                else if(!hasNum || !hasUpper || !hasLower){
                                    return Promise.reject('Please include numbers, upper-case letters, lower-case letters in your password!');
                                }
                                else{
                                    return Promise.resolve();
                                }
                                
                            },
                        }),
                    ]}    
                    hasFeedback
                >
                    <PasswordInput 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        settings={{
                            colorScheme: {
                                levels: ["#ff4033", "#fe940d", "#ffd908", "#cbe11d", "#6ecc3a"],
                                noLevel: "lightgrey"
                            },
                            height: 7,
                            alwaysVisible: true
                        }}
                        inputProps={{
                            size: 'medium'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm New Password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your new password!',
                        },
                        () => ({
                            validator(_, value) {
                            if (!value || password === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject('The two new passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password value={confirm} onChange={(e) => setConfirm(e.target.value)}/>
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

export default ChangePasswordPage
