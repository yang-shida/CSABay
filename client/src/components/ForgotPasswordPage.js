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

const formItemLayout =  { 
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
};

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();

    const [email, setEmail] = useState('')
    const [emailVerification, setEmailVerification] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const onFinish = async () =>{

        const body = {
            email: email,
            emailVerification: emailVerification,
            password: password
        }

        // set body to backend (forget-password)

        // check res code

        if(false /*check email verification*/){
            message.error('Your email verification code is incorrect.')
        }
        else{
            setEmailVerification('')
            setPassword('')
            setConfirm('')
            message.success('Successfully changed your password!')
    
            form.resetFields();
        }
    }

    return (
        <div>
            <h1>Forgot Password</h1>

            <Form
                form={form}
                {...formItemLayout}
                name="change-password"
                onFinish={onFinish}
            >

                <Form.Item
                    name = "email"
                    label = "E-mail"
                    rules = {[
                        {
                            type: 'email',
                            message: 'Please input a valid E-mail'
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                </Form.Item>

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
                            <Button>    
                                Get Code
                            </Button>
                        </Col>
                    </Row>
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

export default ForgotPasswordPage
