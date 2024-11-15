import { Flex } from "antd";
import ImageContainer from "../components/bookDetail/ImageContainer";
import BookInformation from "../components/bookDetail/BookInformation";
import BookReview from "../components/bookDetail/BookReview";
import { useEffect, useState } from "react";
import { TBookDetail } from "../types/book";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../api/products";
import BookUnavailable from "../components/bookDetail/BookUnavailable";

function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<TBookDetail | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1)

  const getBookDetail = async () => {
    try {
      const response = await getProductDetail(id);
      console.log(response)
      setBook(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeQuantity = (value: number) => {
    setPurchaseQuantity(value)
  }

  useEffect(() => {
    getBookDetail();
  }, []);
  console.log(book)
  if (!book) return <BookUnavailable />;

  return (
    <Flex vertical className="px-24 py-8">
      <h1 className="text-4xl font-bold">Thông tin sản phẩm</h1>
      <Flex className="justify-center">
        <ImageContainer
          book={book}
          thumbnailUrl={book.thumbnail}
          imageUrls={book.images}
          purchaseQuantity={purchaseQuantity}
        />
        <BookInformation bookInformation={book} purchaseQuantity={purchaseQuantity} handleChangeQuantity={handleChangeQuantity}/>
      </Flex>
      <BookReview />
    </Flex>
  );
}

export default BookDetail;
