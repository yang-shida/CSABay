import React, { useState } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {PasswordInput} from 'antd-password-input-strength'

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

const SignupForm = () => {
    const [form] = Form.useForm();

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [wechatID, setWechatID] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [phoneNum, setPhoneNum] = useState('')


    const onFinish = async () =>{
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            wechatID: wechatID,
            password: password,
            phoneNum: phoneNum
        }

    const res = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newUser),
    })

        setFirstName('')
        setLastName('')
        setEmail('')
        setWechatID('')
        setPassword('')
        setConfirm('')
        setPhoneNum('')

        form.resetFields();

        // Go to login page
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

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'Please input a valid E-mail!'
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
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
                    label="Confirm Password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        () => ({
                            validator(_, value) {
                            if (!value || password === value) {
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
