import React, { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
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

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

// const base_ = "http://localhost:3001";
const base_ = ""

const ForgotPasswordPage = () => {
    const [form] = Form.useForm();

    const [email, setEmail] = useState('')
    const [emailVerification, setEmailVerification] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const GET_CODE_WAITING = 60
    const [isGetCodeButtonWaiting, setIsGetCodeButtonWaiting] = useState(false)
    const [getCodeButtonWaitingTime, setGetCodeButtonWaitingTime] = useState(GET_CODE_WAITING)
    const [delay, setDelay] = useState(null)

    const emailValidator = (rule, value) => {
		if (!value || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/.test(value)) {
			return Promise.resolve();
		}
		return Promise.reject('Please enter a valid email address!');
	}

    useInterval(
        () => {
            if(getCodeButtonWaitingTime>=1){
                setGetCodeButtonWaitingTime(getCodeButtonWaitingTime-1)
            }
            else{
                setGetCodeButtonWaitingTime(GET_CODE_WAITING)
                setIsGetCodeButtonWaiting(false)
                setDelay(null)
            }
        }, delay
    )

    const onClickGetCode = () => {
        // request code from backend
        const token = {
            email: email.toLowerCase()
        }
        setIsGetCodeButtonWaiting(true)
        axios.post(base_ + '/api/resend', token).then((response) => {
            if(response.data.code === 0){
                // if backend receives the request
                message.success("Email Was Sent!")
                setIsGetCodeButtonWaiting(true)
                setDelay(1000)
            }
            else {
                if(typeof(response.data.message)==="string"){
                    message.error(response.data.message)
                }
                else{
                    message.error("Something went wrong!")
                }
                
            }
        }, (error)=> {
            message.error("Something went wrong!")
            console.log(error)
        });
    }

    const onFinish = async () =>{

        const body = {
            email: email.toLocaleLowerCase(),
            emailVerification: emailVerification,
            pwd: password
        }

        // set body to backend (forget-password)
        axios.put(base_ + '/api/forgot-password', body)
            .then(
                (res) => {
                    if(res.data.code===1){
                        message.error(res.data.message)
                    }
                    else{
                        setEmail('')
                        setEmailVerification('')
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
            <h1>Forgot Password</h1>

            <Form
                form={form}
                {...formItemLayout}
                name="change-password"
                onFinish={onFinish}
            >

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            validator: emailValidator
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Item>

                <Form.Item label="* Email Verification Code">
                    <Row gutter={6}>
                        <Col span={isGetCodeButtonWaiting?14:20}>
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
                        <Col span={isGetCodeButtonWaiting?10:4}>
                            <Button 
                                disabled={
                                    !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/.test(form.getFieldValue('email'))) || isGetCodeButtonWaiting
                                }
                                onClick={onClickGetCode}
                            >    
                                {
                                    isGetCodeButtonWaiting?
                                    `Please wait ${getCodeButtonWaitingTime} s before resending`:
                                    "Get Code"
                                }
                                
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
