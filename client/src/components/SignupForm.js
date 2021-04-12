import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  Tooltip,
  Row,
  Col,
  Button,
  message
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {PasswordInput} from 'antd-password-input-strength'

// const base_ = "http://localhost:3001";
const base_ = ""

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

const SignupForm = () => {
    const [form] = Form.useForm();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [emailVerification, setEmailVerification] = useState('')
    const [wechatID, setWechatID] = useState('')
    const [pwd, setPwd] = useState('')
    const [confirm, setConfirm] = useState('')
    const [phoneNum, setPhoneNum] = useState('')

    const GET_CODE_WAITING = 30
    const [isGetCodeButtonWaiting, setIsGetCodeButtonWaiting] = useState(false)
    const [getCodeButtonWaitingTime, setGetCodeButtonWaitingTime] = useState(GET_CODE_WAITING)
    const [delay, setDelay] = useState(null)


    const onFinish = async () =>{
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            emailVerification: emailVerification,
            wechatID: wechatID.toLowerCase(),
            pwd: pwd,
            phoneNum: phoneNum,
            profilePictureKey: ""
        }

        axios.post(base_ + '/api/add-user', newUser).then((response) => {
            if(response.data.code === 0){
                message.success("Account created!")
                setFirstName('')
                setLastName('')
                setUsername('')
                setEmail('')
                setEmailVerification('')
                setWechatID('')
                setPwd('')
                setConfirm('')
                setPhoneNum('')
        
                form.resetFields();
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

        

        // Go to login page
    }

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
        // if backend receives the request
        const token = {
            email: email.toLowerCase()
        }
        setIsGetCodeButtonWaiting(true)
        axios.post(base_ + '/api/resend', token).then((response) => {
            if(response.data.code === 0){
                message.success("Email Was Sent!")
            }
            else {
                if(typeof(response.data.message)==="string"){
                    message.error(response.data.message)
                }
                else{
                    message.error("Something went wrong 1!")
                }
                
            }
        }, (error)=> {
            message.error("Something went wrong 2!")
            console.log(error)
        });
        setDelay(1000)
    }

    return (
        <div>
            <h1>Register</h1>
            <Form
                form={form}
                {...formItemLayout}
                name="signup"
                onFinish={onFinish}
            >

                <Form.Item
                    name="first-name"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                        },
                    ]
                    }
                >
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="last-name"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                        },
                    ]
                    }
                >
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </Form.Item>

                {/* Can use email as key */}
                {/* <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        // TODO: add rule to make it unique
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]
                    }
                >
                    <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
                </Form.Item> */}

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
                            <Button 
                                disabled={
                                    !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/.test(form.getFieldValue('email'))) || isGetCodeButtonWaiting
                                }
                                onClick={onClickGetCode}
                            >    
                                {
                                    isGetCodeButtonWaiting?
                                    `${getCodeButtonWaitingTime} s`:
                                    "Get Code"
                                }
                                
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>

                

                <Form.Item
                    name="wechat-id"
                    label="WeChat ID"
                >
                    <Input value={wechatID} onChange={(e) => setWechatID(e.target.value)}/>
                </Form.Item>

                <Form.Item 
                    label={
                        <span>
                            Password&nbsp;
                            <Tooltip title="Password should be at least 6 characters long. You should include numbers, upper-case letters, and lower-case letters in your password.">
                            <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
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
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
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
                    label="Confirm Password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        () => ({
                            validator(_, value) {
                            if (!value || pwd === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password value={confirm} onChange={(e) => setConfirm(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    // rules={[
                    //     ()=>({
                    //         validator(_, value){
                    //             if(value==='' || value===undefined){
                    //                 return Promise.resolve();
                    //             }
                    //             else if(!(/^\d+$/.test(value))){
                    //                 return Promise.reject('Phone number should only contain numbers!');
                    //             }
                    //             else{
                    //                 return Promise.resolve();
                    //             }
                    //         }
                    //     })
                    // ]}
                >
                    <Input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)}/>
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

export default SignupForm
