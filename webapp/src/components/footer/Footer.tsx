import { Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Flex
      gap={32}
      className="bg-white rounded-2xl w-3/5 mx-auto px-8 py-4 my-4"
    >
      <Flex vertical className="border-r-[1px] border-r-grey w-1/3">
        <img
          className="w-[220px] cursor-pointer"
          alt="logo"
          src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
          onClick={() => navigate("/")}
        ></img>
      </Flex>
      <Flex gap={32} className="justify-evenly">
        <Flex vertical>
          <p className="font-bold text-xl">DỊCH VỤ</p>
          <ul>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/dieu-khoan-su-dung"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Điều khoản sử dụng
              </Link>
            </li>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/chinh-sach-bao-mat"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Chính sách bảo mật thông tin cá nhân
              </Link>
            </li>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/gioi-thieu"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Giới thiệu Fahasa
              </Link>
            </li>
          </ul>
        </Flex>
        <Flex vertical>
          <p className="font-bold text-xl">HỖ TRỢ</p>
          <ul>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/chinh-sach-doi-tra-hoan-tien"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Chính sách đổi trả hoàn tiền
              </Link>
            </li>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/chinh-sach-bao-hanh"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Chính sách bảo hành
              </Link>
            </li>
            <li className="cursor-pointer hover:text-soft-red">
              <Link
                to="/chinh-sach-van-chuyen"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Chính sách vận chuyển
              </Link>
            </li>
          </ul>
        </Flex>
        <Flex vertical>
          <p
            className="font-bold text-xl"
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            }
          >
            TÀI KHOẢN CỦA TÔI
          </p>
          <ul>
            <li>
              <Link
                to="/login"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Tạo mới tài khoản
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Thay đổi địa chỉ khách hàng
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                Chi tiết tài khoản
              </Link>
            </li>
          </ul>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
