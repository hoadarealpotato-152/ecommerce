import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";;;
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer"; import { Avatar, Layout, Menu, MenuProps } from 'antd';
import { ContactsOutlined, LineChartOutlined, MoneyCollectOutlined, PlusCircleOutlined, ProfileOutlined, ShopFilled, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import CreateProduct from './pages/CreateProduct';
import ListCategory from './pages/ListCategory';
import ListCustomer from './pages/ListCustomer';
import ListProduct from './pages/ListProduct';
const { Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  backgroundColor: 'var(--soft-red)',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'var(--soft-red)',
  minHeight: 100,
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(100%)',
  maxWidth: 'calc(100%)',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: 'var(--grey)',
  backgroundColor: 'white',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: 'var(--grey)',
  backgroundColor: 'white',
};
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <LineChartOutlined />,
    label: 'Thống kê',
  },
  {
    key: 'orderManage',
    icon: <ShopFilled />,
    label: 'Quản lý đơn hàng',
    children: [
      { key: 'orderList', icon: <ProfileOutlined />, label: 'Danh sách đơn hàng' },
    ],
  },
  {
    key: 'productManage',
    icon: <UserOutlined />,
    label: 'Quản lý sản phẩm',
    children: [
      { key: 'productList', icon: <ProfileOutlined />, label: 'Danh sách sản phẩm' },
      { key: 'createProduct', icon: <PlusCircleOutlined />, label: 'Thêm mới sản phẩm' },
    ],
  },
  {
    key: 'categoryManage',
    icon: <ShoppingOutlined />,
    label: 'Quản lý danh mục',
    children: [
      { key: 'categoryList', icon: <ProfileOutlined />, label: 'Danh sách danh mục' },
    ],
  },
  {
    key: 'customerManage',
    icon: <ContactsOutlined />,
    label: 'Quản lý khách hàng',
    children: [
      { key: 'customerList', icon: <ProfileOutlined />, label: 'Danh sách khách hàng' },
    ],
  },
  {
    key: 'saleManage',
    icon: <MoneyCollectOutlined />,
    label: 'Quản lý khuyến mãi',
  },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

function App() {
  const [stateOpenKeys, setStateOpenKeys] = useState(['orderManage', 'orderList']);
  const [selectedKey, setSelectedKey] = useState<string>('dashboard');

  const onMenuSelect: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  }

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  const renderContent = () => {
    switch (selectedKey) {
      case ('createProduct'):
        return <Routes><Route path='/' element={<CreateProduct />}></Route></Routes>;
      case ('productList'):
        return <Routes><Route path='/' element={<ListProduct />}></Route></Routes>;
      case ('categoryList'):
        return <Routes><Route path='/' element={<ListCategory />}></Route></Routes>;
      case ('customerList'):
        return <Routes><Route path='/' element={<ListCustomer />}></Route></Routes>;
    }
  }

  return (
    <Router>
      <Layout style={layoutStyle}>
        <div style={headerStyle}>
          <Header></Header>
        </div>
        <Layout>
          <Sider width="18%" style={siderStyle}>
            <div className='container'>
              <div className='bg-[white] min-h-screen'>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  icon={<UserOutlined />}
                />
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['dashboard']}
                  selectedKeys={[selectedKey]}
                  onClick={onMenuSelect}
                  openKeys={stateOpenKeys}
                  onOpenChange={onOpenChange}
                  items={items}
                />
              </div>
            </div>
          </Sider>
          <Content style={contentStyle}>
            {renderContent()}
          </Content>
        </Layout>
        <div style={footerStyle}>
          <Footer></Footer>
        </div>
      </Layout>
    </Router>

  )
}

export default App;
