import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <Flex gap={32} className='bg-white rounded-2xl w-3/5 mx-auto px-8 py-4 my-4'>
            <Flex vertical className='border-r-[1px] border-r-grey w-1/3'>
                <img
                    className='w-[220px] cursor-pointer'
                    alt='logo'
                    src='https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png'
                    onClick={() => navigate('/')}
                ></img>
            </Flex>
            <Flex gap={32} className='justify-evenly'>
                <Flex vertical>
                    <p className='font-bold text-xl'>DỊCH VỤ</p>
                    <ul>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Điều khoản sử dụng
                        </li>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Chính sách bảo mật thông tin cá nhân
                        </li>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Giới thiệu Fahasa
                        </li>
                    </ul>
                </Flex>
                <Flex vertical>
                    <p className='font-bold text-xl'>HỖ TRỢ</p>
                    <ul>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Chính sách đổi trả hoàn tiền
                        </li>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Chính sách bảo hành
                        </li>
                        <li className='cursor-pointer hover:text-soft-red'>
                            Chính sách vận chuyển
                        </li>
                    </ul>
                </Flex>
                <Flex vertical>
                    <p className='font-bold text-xl'>TÀI KHOẢN CỦA TÔI</p>
                    <ul>
                        <li>Đăng nhập / Tạo mới tài khoản</li>
                        <li>Thay đổi địa chỉ khách hàng</li>
                        <li>Chi tiết tài khoản</li>
                    </ul>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Footer;
