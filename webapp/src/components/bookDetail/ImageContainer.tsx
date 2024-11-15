import { Flex, notification } from "antd";
import SmallContainer from "./SmallContainer";
import Button from "../button/Button";
import { TBookImage, TBookDetail } from "../../types/book";
import { useAppDispatch } from "../../hook/hook";
import { updateCart } from "../../store/cart/cartSlice";
import { TCartItem } from "../../types/cart";

interface IImageContainerProps {
  book: TBookDetail;
  thumbnailUrl: string;
  imageUrls: TBookImage[];
  purchaseQuantity: number;
}

type NotificationType = "success" | "info" | "warning" | "error";

const ImageContainer = (props: IImageContainerProps) => {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useAppDispatch();

  const addItemToCart = () => {
    const newItem: TCartItem = {
      id: props.book.bookId,
      title: props.book.title,
      imageURL: props.imageUrls[0].imageUrl,
      quantity: props.purchaseQuantity,
      originalPrice: props.book.price.basePrice,
      salePrice: props.book.price.basePrice - props.book.price.discountPrice,
    };
    dispatch(updateCart(newItem));
    openNotificationWithIcon("success");
  };

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng",
    });
  };
  return (
    <>
      {contextHolder}
      <Flex vertical gap={8} className="p-4">
        <img className="size-96" src={props.thumbnailUrl}></img>
        <Flex gap={2} justify="center">
          {props.imageUrls.map((book, index) => (
            <SmallContainer key={index} imageUrl={book.imageUrl} />
          ))}
        </Flex>
        <Flex justify="center">
          <Button
            isDisable={props.book.quantity<=0}
            onClick={addItemToCart}
            bgColor={props.book.quantity<=0? "var(--grey)" : "var(--soft-red)"}
            textColor="#FFFFFF"
            text={props.book.quantity<=0? "Hết hàng" : "Thêm vào giỏ hàng"}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default ImageContainer;
