import React, { useEffect, useState } from 'react';
import { Layout, Avatar, Menu, Form, Input, Select, Button as AntButton, List, Modal, message, Alert } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, EditOutlined, KeyOutlined, PlusOutlined, ProfileOutlined, ShoppingOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import Button from '../components/button/Button';
import api from '../api/apiConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResetPass from './ResetPass';

const { Sider, Content } = Layout;
const { Option } = Select;

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

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

type MenuItem = Required<MenuProps>['items'][number];

interface ProfileProps {
    avartar?: string,
    fullName?: string
}

const items: MenuItem[] = [
    {
        key: 'user',
        icon: <UserOutlined />,
        label: 'Thông tin tài khoản',
        children: [
            { key: 'myProfile', icon: <ProfileOutlined />, label: 'Hồ sơ cá nhân' },
            { key: 'changePassword', icon: <KeyOutlined />, label: 'Đổi mật khẩu' },
        ],
    },
    {
        key: 'myOrders',
        icon: <ShoppingOutlined />,
        label: 'Đơn hàng của tôi',
    },
    {
        key: 'notifications',
        icon: <BellOutlined />,
        label: 'Thông báo',
    },
    {
        key: 'myReviews',
        icon: <StarOutlined />,
        label: 'Đánh giá của tôi',
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

interface Address {
    addressId: string;
    city: string;
    province: string;
    district: string;
    detailAddress: string;
}

interface Profile {
    accountId: string;
    avatar: string;
    email: string;
    fullname: string;
    listAddress: Address[];
    phone: string;
}
interface Cities {
    _id: string;
    name: string;
    slug: string;
    type: string;
    name_with_type: string | '';
    code: string;
    isDeleted: boolean;
}
interface Province {
    _id: string;
    name: string;
    slug: string;
    type: string;
    name_with_type: string;
    path: string;
    path_with_type: string;
    code: string;
    parent_code: string;
    isDeleted: boolean;
}
interface District {
    _id: string;
    name: string;
    slug: string;
    type: string;
    name_with_type: string;
    path: string;
    path_with_type: string;
    code: string;
    parent_code: string;
    isDeleted: boolean;
}
interface ApiResponseCity {
    exitcode: number;
    data: {
        nItems: number;
        nPages: number;
        data: Cities[];
    };
}
interface ApiResponseProvince {
    exitcode: number;
    data: {
        nItems: number;
        nPages: number;
        data: Province[];
    };
}
interface ApiResponseDistrict {
    exitcode: number;
    data: {
        nItems: number;
        nPages: number;
        data: District[];
    };
}

const Profile: React.FC = (props: ProfileProps) => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['user', 'myProfile']);
    const [selectedKey, setSelectedKey] = useState<string>('myProfile');
    const [profile, setProfile] = useState<Profile>();
    const [form] = Form.useForm();
    const [addressForm] = Form.useForm();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [backendError, setBackendError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await api.get(`/v1/accounts/myInfo`);
                setProfile(response.data.data.content);
                setAddresses(response.data.data.content?.listAddress || []);
                console.log(profile);
                console.log(addresses);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const backendError = error.response.data.msg;
                    console.error("Load profile failed:", backendError);
                    message.error('TẢI HỒ SƠ CÁ NHÂN THẤT BẠI.');
                }
            }
        } else {
            navigate('/login');
        }
    };

    const fetchProvinces = async () => {
        const response = await api.get<ApiResponseCity>('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
        const data: ApiResponseCity = response.data;
        if (data.exitcode === 1) {
            setProvinces(data.data.data);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchProvinces();
    }, []);

    useEffect(() => {
        form.resetFields();
    }, [profile, addresses]);

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

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="0">+84</Option>
            </Select>
        </Form.Item>
    );

    const handleFinish = async () => {
        const values = form.getFieldsValue();
        console.log(values)
        console.log(addresses);
        const formatedValues = {
            fullname: values.fullname,
            phone: `${values.prefix}${values.phone}`,
            avatar: 'url_avt',
            listAddress: addresses
        };
        console.log(formatedValues)
        try {
            const response = await api.put('/v1/accounts', formatedValues);
            console.log(response.data)
            setBackendError(null);
            message.success(
                "CẬP NHẬT HỒ SƠ THÀNH CÔNG",
                10
            );
            fetchProfile();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const backendError = error.response.data.msg;
                console.log("Lỗi: " + backendError);
                setBackendError(backendError);
            }
            message.error("CẬP NHẬT HỒ SƠ THẤT BẠI. Vui lòng thử lại!", 10);
        }

    }

    const onReset = () => {
        form.resetFields();
    };

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address>({
        addressId: '',
        city: '',
        province: '',
        district: '',
        detailAddress: '',
    });

    const showModal = (address?: Address, index?: number) => {
        setCurrentAddress(address || {
            addressId: '',
            city: '',
            province: '',
            district: '',
            detailAddress: '',
        });
        addressForm.setFieldValue("detailAddress", address?.detailAddress);
        setEditingIndex(index !== undefined ? index : null);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (editingIndex !== null) {
            const newAddresses = [...addresses];
            newAddresses[editingIndex] = { ...currentAddress };
            setAddresses(newAddresses);
        } else {
            setAddresses([...addresses, { ...currentAddress }].slice(0, 5));
        }
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // const handleDelete = (index: number) => {
    //     setAddresses(addresses.filter((_, i) => i !== index));
    // };

    const [provinces, setProvinces] = useState<Cities[]>([]);
    const [districts, setDistricts] = useState<Province[]>([]);
    const [wards, setWards] = useState<District[]>([]);


    const handleProvinceChange = async (provinceCode: string) => {
        const response = await api.get<ApiResponseProvince>(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
        const data: ApiResponseProvince = response.data;
        if (data.exitcode === 1) {
            const selectedProvince = provinces.find((province) => province.code === provinceCode);
            setDistricts(data.data.data);
            setCurrentAddress({ ...currentAddress, city: (selectedProvince ? selectedProvince.name_with_type : ""), province: '', district: '' });
            setWards([]);
        }
    };

    const handleDistrictChange = async (districtCode: string) => {
        const response = await api.get<ApiResponseDistrict>(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
        const data: ApiResponseDistrict = response.data;
        if (data.exitcode === 1) {
            const selectedDistrict = districts.find((district) => district.code === districtCode);
            setWards(data.data.data);
            setCurrentAddress({ ...currentAddress, province: selectedDistrict ? selectedDistrict.name_with_type : "", district: '' });
        }
    };

    const renderContent = () => {
        switch (selectedKey) {
            case ('myProfile'): {
                const initialValues = {
                    prefix: '0',
                    username: localStorage.getItem('username'),
                    fullname: profile?.fullname,
                    email: profile?.email,
                    phone: profile?.phone.substring(1),
                    listAddress: addresses
                };
                console.log(initialValues);
                return <div className="max-w-screen min-h-28 bg-white pt-10 pb-10 justify-left items-center px-4 sm:px-6 lg:px-8"
                >
                    <div className="container flec-col max-w-screen w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
                        <Form
                            className='bg-[white]'
                            {...formItemLayout}
                            variant='outlined'
                            form={form}
                            initialValues={initialValues}
                        >
                            {backendError && (
                                <Alert
                                    className="mb-6"
                                    message="CẬP NHẬT HỒ SƠ THẤT BẠI"
                                    description={backendError}
                                    type="error"
                                    showIcon
                                />
                            )}
                            <h1 className="text-center mb-6 font-semibold text-lg">
                                HỒ SƠ CÁ NHÂN
                            </h1>
                            <Form.Item
                                label="Tên tài khoản"
                                name="username">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="Họ và Tên"
                                name="fullname"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập Họ và Tên của bạn!",
                                    },
                                    {
                                        pattern: /^.{1,50}$/,
                                        message: "Họ và tên không được vượt quá 50 kí tự.",
                                    },
                                ]}
                            >
                                <Input placeholder='Họ và Tên' />
                            </Form.Item>
                            <Form.Item
                                label="Số Điện Thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: "Nhập số điện thoại của bạn!" },
                                    {
                                        pattern: /^\d{9}$/,
                                        message: "Vui lòng nhập đúng 9 chữ số điện thoại (sau số 0).",
                                    },
                                ]}
                            >
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder='Số điện thoại' />
                            </Form.Item>
                            <Form.Item className='text-center'
                                label="Địa chỉ của tôi"
                            // name="addresses"
                            >
                                <div>
                                    <List
                                        className="mt-4"
                                        bordered
                                        dataSource={addresses}
                                        renderItem={(address, index) => (
                                            <List.Item
                                                actions={[
                                                    <AntButton icon={<EditOutlined />} onClick={() => showModal(address, index)} />,
                                                    // <AntButton icon={<DeleteOutlined />} onClick={() => handleDelete(index)} />,
                                                ]}
                                            >
                                                <div className="text-left">
                                                    <p><span className='font-semibold'>Tỉnh/Thành phố:</span> {address.city}</p>
                                                    <p><span className='font-semibold'>Quận/Huyện:</span> {address.province}</p>
                                                    <p><span className='font-semibold'>Phường/Xã:</span> {address.district}</p>
                                                    <p><span className='font-semibold'>Địa chỉ cụ thể:</span> {address.detailAddress}</p>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                    <div className='text-left'>
                                        <AntButton className='text-left mt-2 mr-2' type="dashed" onClick={() => showModal()} icon={<PlusOutlined />}>
                                            Thêm địa chỉ
                                        </AntButton>
                                        <span className='text-soft-red'>Người dùng chỉ có thể lưu tối đa 5 địa chỉ trong sổ địa chỉ</span>
                                    </div>
                                    <Modal
                                        title={editingIndex !== null ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
                                        visible={isModalVisible}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        <Form layout="vertical" form={addressForm}>
                                            <Form.Item label="Tỉnh/Thành phố">
                                                <Select
                                                    value={currentAddress.city}
                                                    onChange={(value) => {
                                                        // setCurrentAddress({ ...currentAddress, city: value });
                                                        handleProvinceChange(value);
                                                    }}
                                                >
                                                    {provinces.map(province => (
                                                        <Select.Option key={province.code} value={province.code}>
                                                            {province.name_with_type}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="Quận/Huyện">
                                                <Select
                                                    value={currentAddress.province}
                                                    onChange={(value) => {
                                                        setCurrentAddress({ ...currentAddress, province: value });
                                                        handleDistrictChange(value);
                                                    }}
                                                >
                                                    {districts.map(district => (
                                                        <Select.Option key={district.code} value={district.code}>
                                                            {district.name_with_type}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="Xã/Phường">
                                                <Select
                                                    value={currentAddress.district}
                                                    onChange={(value) => {
                                                        setCurrentAddress({ ...currentAddress, district: value });
                                                    }}
                                                >
                                                    {wards.map(ward => (
                                                        <Select.Option key={ward.code} value={ward.name_with_type}>
                                                            {ward.name_with_type}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                name='detailAddress'
                                                label='Địa chỉ cụ thể'
                                            >
                                                <Input defaultValue={currentAddress.detailAddress} placeholder='Địa chỉ cụ thể' onChange={(e) => { setCurrentAddress({ ...currentAddress, detailAddress: e.target.value }); }}></Input>
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </div>
                            </Form.Item>

                            <Form.Item className='text-left pt-3' wrapperCol={{ offset: 6, span: 16 }}>
                                <Button onClick={() => { handleFinish() }} bgColor='var(--soft-red)' borderColor='white' text='Lưu thay đổi' textColor='white' />
                                <AntButton className='h-[50px] rounded-[200px] border-[1px] ml-[10px]'
                                    htmlType="button"
                                    onClick={onReset}>
                                    Hủy
                                </AntButton>
                            </Form.Item>
                        </Form>
                    </div>

                </div >
            }
                ;
            case ('changePassword'):
                return <div className='justify-center'><ResetPass></ResetPass></div>;
            case ('myOrders'):
                return <div>ord</div>;
            case ('notifications'):
                return <div>noti</div>;
            case ('myReviews'):
                return <div>rv</div>;
        }
    }

    return (
        <main>
            <Layout>
                <Sider width="25%" style={siderStyle}>
                    <div className='container'>
                        <div className='bg-[white] min-h-screen'>
                            <Avatar
                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                icon={<UserOutlined />}
                                src={props.avartar}
                            />
                            <h2>{props.fullName}</h2>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['myProfile']}
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

        </main>

    );
};
export default Profile;