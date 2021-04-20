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
import {PasswordInput} from 'antd-password-input-strength'
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const formItemLayout = {
    labelCol: {
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
            span: 6,
        },
    },
    wrapperCol: {
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

// const base_ = "http://localhost:3001";
const base_ = ""

const ChangePasswordPage = ({user, setUser}) => {

    const [form] = Form.useForm();

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const onFinish = async () =>{

        const pwds = {pwd: password, oldPwd: oldPassword}

        axios.put(base_ + '/api/change-password', pwds)
            .then(
                (res) => {
                    if(res.data.code===1){
                        message.error(res.data.message)
                    }
                    else{
                        setOldPassword('')
                        setPassword('')
                        setConfirm('')
                        message.success(res.data.message)
                
                        form.resetFields();
                        
                    }
                }
            )
            .catch(
                (err) => {
                    message.error("Something went wrong!")
                    console.log(err)
                }
            )
            
        }


    


    return (
        <div>
            <h1>Change Password</h1>
            <Form
                form={form}
                {...formItemLayout}
                name="change-password"
                onFinish={onFinish}
            >

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
