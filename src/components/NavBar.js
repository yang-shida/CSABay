import { Menu } from 'antd';
import {useState} from 'react'
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'

const { SubMenu } = Menu;

const NavBar = () => {
    const [currentPage, setCurrentPage] = useState('home')

    const handleClick = e => {
        setCurrentPage(e.key);
    };

    return (
        <div>
            <Menu onClick={handleClick} selectedKeys={[currentPage]} mode="horizontal">
                
                <Menu.Item key="home" style={{margin: '0px 5px 0px 10px', padding: '0px 20px', fontSize: '18px'}}>
                    <Link to='/'>UF CSABay</Link>
                </Menu.Item>

                <Menu.Item key="create-post" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                    <Link to='/create-post'>New Post</Link>
                </Menu.Item>

                <Menu.Item key="placeholder2" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                    <Link to='/register'>Test Register Page</Link>
                </Menu.Item>

                {/* <SubMenu key="SubMenu" title="Navigation Three - Submenu" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                    <Menu.ItemGroup title="Item 1">
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="Item 2">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu> */}

                {/* <Menu.Item key="alipay" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer">
                        Navigation Four - Link
                    </a>
                </Menu.Item> */}

                <SubMenu key="user-info"

                    icon = {<Avatar size="default" src="../CSA_icon.jpg" style={{marginRight: '10px'}}/>} 
                    title="CSA Test User" 
                    style={{float: 'right', margin: '0px 10px 0px 0px', padding: '0px'}}>
                    
                    <Menu.Item key="profile"><Link to='/profile'>User Profile</Link></Menu.Item>
                    <Menu.Item key="my-posts">My Posts</Menu.Item>
                    <Menu.Item key="liked-posts">Liked Posts</Menu.Item>
                    <Menu.Item key="change-password">Change Password</Menu.Item>
                    <Menu.Item key="sign-out">Sign Out</Menu.Item>
                    

                </SubMenu>

            </Menu>
        </div>
    )
}

export default NavBar

