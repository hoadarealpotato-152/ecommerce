import { Badge, Dropdown, Flex, MenuProps, message, Popover } from 'antd';
import Search from '../search/Search';
import {
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import { getProductsList } from '../../api/products';
import { useDispatch } from 'react-redux';
import { updateBookState } from '../../store/book/bookSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import CategoryList from './CategoryList';

const Header = () => {
  const navigate = useNavigate();
  const { cartItem } = useSelector((state: RootState) => state.cartReducer);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const dispatch = useDispatch();

  const items: MenuProps['items'] = [];

  const handleSearch = async (value: string) => {
    try {
      const data = await getProductsList({
        title: value.toLowerCase(),
        page: 0,
      });
      if (data) {
        dispatch(
          updateBookState({
            bookList: data.books,
            totalItems: data.totalItems,
            searchValue: value,
            currentPage: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setIsLoading(false);
    }
  };

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
        label: <a href='/profile'>Hồ sơ cá nhân</a>,
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: <a onClick={handleLogout}>Đăng xuất</a>,
      }
    );
  } else {
    items.push(
      {
        key: 'login',
        label: <a href='/login'>Đăng nhập</a>,
      },
      {
        key: 'register',
        label: <a href='/register'>Đăng ký</a>,
      }
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
        message.success(
          'Bạn đã đăng xuất. Vui lòng đăng nhập để tiếp tục mua hàng.',
          10
        );
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      message.error(
        'Đăng xuất thất bại. Có vẻ như có lỗi xảy ra. Vui lòng thử lại.',
        10
      );
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
  }

  return (
    <Flex className='py-4 px-8 w-full h-17 bg-soft-red' align='center' gap={8}>
      <img
        className='w-[220px] cursor-pointer'
        alt='logo'
        src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png'
        onClick={() => navigate('/')}
      ></img>
      <Popover
        trigger='click'
        placement='bottomLeft'
        content={<CategoryList />}
      >
        <Flex
          vertical
          align='center'
          className='text-white text-center hover:bg-red cursor-pointer rounded-xl p-2'
        >
          <MenuUnfoldOutlined />
          <p className='text-xs'>Danh mục</p>
        </Flex>
      </Popover>
      <Search placeholder='Tìm kiếm sản phẩm' onSearch={handleSearch} />
      <Flex
        vertical
        align='center'
        className='text-white text-center hover:bg-red cursor-pointer rounded-xl p-2'
        onClick={() => navigate('/cart')}
      >
        <Badge count={cartItem.length}>
          <ShoppingCartOutlined className='text-white' />
        </Badge>
      </Flex>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Flex
            vertical
            align='center'
            className='text-white text-center hover:bg-red cursor-pointer rounded-xl p-2'
          >
            <UserOutlined />
          </Flex>
        </a>
      </Dropdown>
    </Flex>
  );
};

export default Header;
