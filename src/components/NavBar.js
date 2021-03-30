import { Menu } from 'antd';
import {useState} from 'react'
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'

const { SubMenu } = Menu;

const NavBar = ({user, currentRoute}) => {
    const [currentPage, setCurrentPage] = useState(currentRoute)

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

                <Menu.Item key="register-page" style={{margin: '0px 5px 0px 5px', padding: '0px 20px'}}>
                    <Link to='/register'>Test Register Page</Link>
                </Menu.Item>

                <SubMenu key="user-info"

                    icon = {<Avatar size="default" src="../CSA_icon.jpg" style={{marginRight: '10px'}}/>} 
                    title= {`${user.firstName} ${user.lastName}`}
                    style={{float: 'right', margin: '0px 10px 0px 0px', padding: '0px'}}>
                    
                    <Menu.Item key="profile"><Link to='/profile'>User Profile</Link></Menu.Item>
                    <Menu.Item key="sign-out">Sign Out</Menu.Item>
                    

                </SubMenu>

            </Menu>
        </div>
    )
}

export default NavBar

