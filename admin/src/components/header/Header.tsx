import { Dropdown, Flex, MenuProps, message} from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiConfig";
import { UserOutlined } from "@ant-design/icons";


const Header = () => {

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    const items: MenuProps['items'] = [];

    if (accessToken && refreshToken && username && userId) {
        items.push(
            {
                key: 'user',
                label: username,
                disabled: true,
            },
            {
                type: 'divider',
            },    
            {
                key: 'myProfile',
                label: (<a href="/profile">Hồ sơ cá nhân</a>),
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: (<a onClick={handleLogout}>Đăng xuất</a>),
            }
        );
    } else {
        items.push(
            {
                key: 'login',
                label: (<a href="/login">Đăng nhập</a>),
            },
            {
                key: 'register',
                label: (<a href="/register">Đăng ký</a>),
            },
        );
    }

    async function handleLogout(): Promise<void> {
        try {
            if (accessToken && refreshToken && username && userId) {
                await api.post('/v1/auth/logout', { refreshToken: refreshToken });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                message.success('Bạn đã đăng xuất. Vui lòng đăng nhập để tiếp tục mua hàng.', 10);
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout failed:", error);
            message.error('Đăng xuất thất bại. Có vẻ như có lỗi xảy ra. Vui lòng thử lại.', 10);
        }
    }

    return (
        <Flex className="py-4 px-8 w-full h-17 bg-soft-red justify-between" align="center">
            <img className="w-[220px] cursor-pointer" alt="logo" src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png" onClick={() => navigate('/')}></img>
            <h1 className="text-white text-2xl">Trang quản lý</h1>
            <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Flex vertical align="center" className="text-white text-center hover:bg-red cursor-pointer rounded-xl p-2">
                        <UserOutlined />
                    </Flex>
                </a>
            </Dropdown>
        </Flex>
    )
}

export default Header;