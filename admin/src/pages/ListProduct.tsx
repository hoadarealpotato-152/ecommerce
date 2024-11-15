import { Button, Flex, Pagination, Table } from "antd";
import { formatPrice } from "../utils/priceFormat";
import { useEffect, useState } from "react";
import { TBook } from "../types/book";
import { getProductsList } from "../api/products";
import { BOOK_ITEM_PER_PAGE } from "../types/const";

function ListProduct() {
  const [books, setBooks] = useState<TBook[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const columns = [
    {
      title: "Mã hàng",
      dataIndex: "bookId",
      key: "bookId",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (imageURL: string) => (
        <img className="size-6" src={imageURL}></img>
      ),
    },
    {
      title: "Đánh giá trung bình",
      dataIndex: "averageRating",
      key: "averageRating",
    },
    {
      title: "Giá gốc",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (basePrice: number) => <span>{formatPrice(basePrice)}</span>,
    },
    {
      title: "Giá giảm",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (discountPrice: number) => (
        <span>{formatPrice(discountPrice)}</span>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Thể loại",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisherName",
      key: "publisherName",
    },
    {
      title: "Tổng lượt bán",
      dataIndex: "totalSalesCount",
      key: "totalSalesCount",
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Button onClick={() => {}} type="primary">
          Xóa
        </Button>
      ),
    },
  ];

  const getListProduct = async () => {
    try {
      const response = await getProductsList({ page: pageIndex });
      if (response) {
        setBooks(response.books);
        setTotalItems(response.totalItems)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListProduct();
  }, [pageIndex]);

  return (
    <Flex gap={32} vertical className="px-24 py-8">
      <h1 className="text-4xl font-bold">Danh sách sản phẩm</h1>
      <Table columns={columns} dataSource={books} />
      <Pagination
        className="mt-4 flex justify-center"
        defaultCurrent={1}
        total={totalItems}
        pageSize={BOOK_ITEM_PER_PAGE}
        onChange={(current) => setPageIndex(current)}
      />
    </Flex>
  );
}

export default ListProduct;
