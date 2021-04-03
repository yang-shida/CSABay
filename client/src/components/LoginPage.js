import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { PasswordInput } from 'antd-password-input-strength';
import auth from '../auth/auth'
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

const LoginPage = ({routerProps, setUserInfo}) => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const fetchUser = async(userID) =>{
        const res = await fetch(`http://localhost:8080/users/${userID}`)
        const data = await res.json()
        return data
    }

    const onFinish = async () => {
        // check if username exists, then check is password patches
        const userFromServer = await fetchUser(1)
        auth.login(
            () => {
                setUserInfo(userFromServer)
                routerProps.history.push("/")
            }
        )

        setEmail('');
        setPassword('');
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
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)}/>
                    
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