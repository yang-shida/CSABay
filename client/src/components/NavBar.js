import { Menu } from 'antd';
import {useState, useEffect} from 'react'
import { Avatar, Image, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'
import auth from '../auth/auth';
import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST, S3_DELETE_BY_KEY, S3_UPLOAD_SINGLE_FILE} from './S3'

const { SubMenu } = Menu;

const NavBar = ({isAuthenticated=false, user, currentRoute, routerProps, setUserInfo}) => {
    const [currentPage, setCurrentPage] = useState(currentRoute)
    const [isConfirmLogoutVisible, setIsConfirmLogoutVisible] = useState(false)

    const [profilePictureURL, setProfilePictureURL] = useState("")

    useEffect(
        () => {
            setCurrentPage(currentRoute)
            setIsConfirmLogoutVisible(false)
        }, [currentRoute]
    )

    useEffect(
        () => {
            if(isAuthenticated && user.profilePictureKey !== ""){
                S3_GET(user.profilePictureKey)
                    .then(
                        (url) => {
                            setProfilePictureURL(url)
                        }
                    )
            }
        }, [user]
    )

    const handleClick = e => {
        setCurrentPage(e.key);
    };

    const onLogoutConfirm = () => {
        auth.logout(
            () => {
                routerProps.history.push('/')
                setIsConfirmLogoutVisible(false)
                setUserInfo()
            }
        )
    }

    const onLogoutCancel = () => {
        setCurrentPage(currentRoute)
        setIsConfirmLogoutVisible(false)
    }

    return (
        <div>

            {
                isAuthenticated?
                <Menu onClick={handleClick} selectedKeys={[currentPage]} mode="horizontal">

                    <Menu.Item key="home" style={{margin: '0px 5px 0px 10px', padding: '0px 20px', fontSize: '18px'}}>
                        <Link to='/'>UF CSABay</Link>
                    </Menu.Item>

                    <Menu.Item key="create-post" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                        <Link to='/create-post'>New Post</Link>
                    </Menu.Item>

                    <SubMenu key="user-info"
                        icon = {
                            user.profilePictureKey===""?
                            <Avatar size="default" style={{marginRight: '10px'}}>{`${user.firstName.substring(0,1)}${user.lastName.substring(0,1)}`}</Avatar>:
                            <Avatar size="default" src={profilePictureURL} style={{marginRight: '10px'}} />
                        }
                        title= {`${user.firstName} ${user.lastName}`}
                        style={{float: 'right', margin: '0px 10px 0px 0px', padding: '0px'}}
                    >
                        
                        <Menu.Item key="profile"><Link to='/profile'>User Profile</Link></Menu.Item>
                        <Menu.Item key="sign-out" onClick={()=>{setIsConfirmLogoutVisible(true)}}>
                            Logout
                        </Menu.Item>
                        
                    </SubMenu>

                </Menu>
                :
                <Menu onClick={handleClick} selectedKeys={[currentPage]} mode="horizontal">

                    <Menu.Item key="home" style={{margin: '0px 5px 0px 10px', padding: '0px 20px', fontSize: '18px'}}>
                        <Link to='/'>UF CSABay</Link>
                    </Menu.Item>

                    <SubMenu key="user-info"
                        icon = {<Avatar size="default" icon={<UserOutlined />} style={{marginRight: '10px'}}/>} 
                        title= "Please Login"
                        style={{float: 'right', margin: '0px 10px 0px 0px', padding: '0px'}}
                    >
                        <Menu.Item key="login">
                            <Link to='/login'>Login</Link>
                        </Menu.Item>
                        <Menu.Item key="forgot-password">
                            <Link to='/forgot-password'>Forgot Password</Link>
                        </Menu.Item>
                        <Menu.Item key="register">
                            <Link to='/register'>Register</Link>
                        </Menu.Item>
                    </SubMenu>
                    
                </Menu>

            }

            <Modal title="Confirm Logout" visible={isConfirmLogoutVisible} onOk={onLogoutConfirm} onCancel={onLogoutCancel}>
                <p>Are you sure to log out?</p>
            </Modal>
        </div>
    )
}

export default NavBar

