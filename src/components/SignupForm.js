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

    const onFinish = () =>{

    }



    return (
        <div>
            <h1>Register</h1>
            <Form
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
                    <Input />
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
                    <Input />
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
                    <Input />
                </Form.Item>

                <Form.Item
                    name="wechat-id"
                    label="WeChat ID"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label={
                    <span>
                        Nickname&nbsp;
                        <Tooltip title="What do you want others to call you?">
                        <QuestionCircleOutlined />
                        </Tooltip>
                    </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input your nickname!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                    ]}
                >
                    <Input
                    style={{
                        width: '100%',
                    }}
                    />
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
