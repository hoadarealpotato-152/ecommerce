import { Button, Flex, notification, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { TCartItem } from "../types/cart";
import { useAppDispatch, useAppSelector } from "../hook/hook";
import {
  cartSelector,
  removeAllItem,
  removeFromCart,
} from "../store/cart/cartSlice";
import { formatPrice } from "../utils/priceFormat";

type NotificationType = "success" | "info" | "warning" | "error";

function Cart() {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(cartSelector);
  const [cartItems, setCartItems] = useState<Array<TCartItem>>([]);

  useEffect(() => {
    setCartItems(selectedItems.cartReducer.cartItem);
  }, []);

  const calculateTotalPrice = useMemo(() => {
    return cartItems.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.salePrice * currentValue.quantity,
      0
    );
  }, [cartItems]);

  const removeCartItem = (targetItem: TCartItem) => {
    dispatch(removeFromCart(targetItem));
    const newCart = cartItems.filter((item) => item.id !== targetItem.id);
    openRemoveFromCartNotification("success", targetItem);
    setCartItems(newCart);
  };

  const clearCart = () => {
    dispatch(removeAllItem());
    setCartItems([]);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (imageURL: string) => (
        <img className="size-32" src={imageURL}></img>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá gốc",
      dataIndex: "originalPrice",
      key: "originalPrice",
      render: (price: number) => <span>{formatPrice(price)}</span>,
    },
    {
      title: "Giá giảm",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (price: number) => <span>{formatPrice(price)}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (record: TCartItem) => (
        <Button onClick={() => removeCartItem(record)} type="primary">
          Xóa
        </Button>
      ),
    },
  ];

  const openRemoveFromCartNotification = (
    type: NotificationType,
    item: TCartItem
  ) => {
    api[type]({
      message: "Thành công",
      description: `Sản phẩm ${item.title} đã được xóa khỏi giỏ hàng`,
    });
  };

  return (
    <>
      {contextHolder}
      <Flex gap={32} vertical className="px-24 py-8">
        <Flex className="w-full justify-between">
          <h1 className="text-4xl font-bold">Giỏ hàng</h1>
          <Flex gap={32}>
            <h1 className="text-2xl font-bold">
              Tổng tiền: {formatPrice(calculateTotalPrice)}
            </h1>
            <Button type="primary">Đặt hàng</Button>
          </Flex>
        </Flex>
        <Table columns={columns} dataSource={cartItems} />
        <Button className="w-36 m-auto" type="primary" onClick={clearCart}>
          Xóa tất cả
        </Button>
      </Flex>
    </>
  );
}

export default Cart;
