import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { PasswordInput } from 'antd-password-input-strength';
import auth from '../auth/auth'
import axios from 'axios';
import {Link} from 'react-router-dom'

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

// const base_ = "http://localhost:3001";
const base_ = ""

const LoginPage = ({routerProps, setUserInfo, setIsAuth}) => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const onFinish = async () => {
        const userInfo = {
            email: email.toLocaleLowerCase(),
            pwd: pwd
        }

        axios.post(base_ + '/api/user-login', userInfo)
            .then(
                (res) => {
                    if(res.data.code === 1){
                        message.error(res.data.message)
                    }
                    else{
                        message.success("Login success!")
                        auth.login(
                            () => {
                                setUserInfo(res.data.data)
                                setIsAuth(true)
                                routerProps.history.push("/")
                            }
                        )
                    }
                    
                }
            )
            .catch(
                (err) => {
                    message.error("Something went wrong!")
                    console.log(err)
                }
            )

        setEmail('');
        setPwd('');
        form.resetFields();
    }

    return (
        <div>
            <h1>Log In</h1>
            <Form
                form = {form}
                {...formItemLayout}
                name = "login"
                onFinish = {onFinish}
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
                
                <Form.Item
                    name = "password"
                    label = "Password"
                    rules = {[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password value={pwd} onChange={(e) => setPwd(e.target.value)}/>
                    
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type = "primary" htmlType = "submit">
                        Log In
                    </Button>
                    <Link to='/forgot-password'>&nbsp;&nbsp;&nbsp;&nbsp;Forgot password?</Link>
                </Form.Item>

            </Form>

        </div>
    )
}
export default LoginPage