import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const CommonBreadcrumb: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  interface BreadcrumbItem {
    path?: string;
    title: string;
  }

  type BreadcrumbMap = {
    [key: string]: BreadcrumbItem[];
  };

  const breadcrumbMap: BreadcrumbMap = {
    "/login": [
      { path: "/", title: "Trang chủ" },
      { path: "/login", title: "Đăng nhập" },
    ],

    "/register": [
      { path: "/", title: "Trang chủ" },
      { path: "/register", title: "Đăng ký" },
    ],

    "/OTPInput": [
      { path: "/", title: "Trang chủ" },
      { path: "/OTPInput", title: "Kích hoạt tài khoản" },
    ],

    "/forgotPass": [
      { path: "/", title: "Trang chủ" },
      { path: "/forgotPass", title: "Quên mật khẩu" },
    ],

    "/resetPass": [
      { path: "/", title: "Trang chủ" },
      { path: "/resetPass", title: "Đặt lại mật khẩu" },
    ],

    "/profile": [
      { path: "/", title: "Trang chủ" },
      { path: "/profile", title: "Hồ sơ cá nhân" },
    ],

    "/cart": [
      { path: "/", title: "Trang chủ" },
      { path: "/cart", title: "Giỏ hàng" },
    ],

    "/category": [
      { path: "/", title: "Trang chủ" },
      { path: "/category", title: "Danh mục" },
    ],
    "/dieu-khoan-su-dung": [
      { path: "/", title: "Trang chủ" },
      { path: "/dieu-khoan-su-dung", title: "Điều khoản sử dụng" },
    ],
    "/chinh-sach-bao-mat": [
      { path: "/", title: "Trang chủ" },
      {
        path: "/chinh-sach-bao-mat",
        title: "Chính sách bảo mật thông tin cá nhân",
      },
    ],
    "/gioi-thieu": [
      { path: "/", title: "Trang chủ" },
      { path: "/gioi-thieu", title: "Giới thiệu" },
    ],
    "/chinh-sach-doi-tra-hoan-tien": [
      { path: "/", title: "Trang chủ" },
      {
        path: "/chinh-sach-doi-tra-hoan-tien",
        title: "Chính sách đổi trả hoàn tiền",
      },
    ],
    "/chinh-sach-bao-hanh": [
      { path: "/", title: "Trang chủ" },
      { path: "/chinh-sach-bao-hanh", title: "Chính sách bảo hành" },
    ],
    "/chinh-sach-van-chuyen": [
      { path: "/", title: "Trang chủ" },
      { path: "/chinh-sach-van-chuyen", title: "Chính sách vận chuyển" },
    ],
  };

  const breadcrumbItems = currentPath.startsWith("/book/")
    ? breadcrumbMap["/book"]
    : breadcrumbMap[currentPath] || [];

  if (currentPath.startsWith("/book/"))
    return (
      <Breadcrumb
        className={"my-4 mx-4 text-red "}
        items={[
          {
            title: "Trang chủ",
            href: "/",
          },
          {
            title: ":id",
            href: "/book/" + currentPath.split("/")[2],
          },
        ]}
        params={{ id: currentPath.split("/")[2] }}
      />
    );
  // return <Breadcrumb className={"my-4"} items={breadcrumbItems}></Breadcrumb>;
  return (
    <Breadcrumb className={"my-4 mx-4 text-red"}>
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.path ? <Link to={item.path}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CommonBreadcrumb;
