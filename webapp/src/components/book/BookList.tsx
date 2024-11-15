import { Flex, Pagination } from "antd";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TBookListReturn } from "../../types/book";
import { BOOK_ITEM_PER_PAGE } from "../../types/const";
import LoadingScreen from "../loading/LoadingScreen";
import NoResult from "./NoResult";
import { getProductsList } from "../../api/products";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useDispatch } from "react-redux";
import { updateBookState } from "../../store/book/bookSlice";

const BookList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { bookList, totalItems, searchValue, currentPage } = useSelector(
    (state: RootState) => state.bookReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getBookList(0, "");
  }, []);

  const getBookList = async (pageNum: number, searchKey: string) => {
    try {
      const data: TBookListReturn | null = await getProductsList({
        page: pageNum == 0 ? pageNum : pageNum - 1,
        title: searchKey,
      });
      if (data) {
        dispatch(
          updateBookState({
            bookList: data.books,
            currentPage: pageNum,
            totalItems: data.totalItems,
            searchValue: searchKey,
          })
        );
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const goPage = (pageNum: number) => {
    getBookList(pageNum, searchValue);
  };

  const navigate = useNavigate();

  if (!isLoading && bookList.length === 0) {
    return (
      <>
        <NoResult />
        <Pagination
          className="mt-8"
          align="center"
          pageSize={BOOK_ITEM_PER_PAGE}
          defaultCurrent={1}
          current={currentPage}
          total={totalItems}
          showSizeChanger={false}
          onChange={(current) => goPage(current)}
        />
      </>
    );
  }

  return (
    <Flex vertical>
      <Flex wrap gap={24} align="center">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {bookList.map((book) => (
              <BookCard
                key={book.bookId}
                book_image={book.thumbnail}
                book_title={book.title}
                category={book.categoryName}
                author={book.authorName}
                original_price={book.basePrice}
                sale_price={book.basePrice - book.discountPrice}
                ratings={book.averageRating}
                total_reviews={book.totalSalesCount}
                onClick={() => {
                  navigate(`/book/${book.bookId}`);
                }}
              />
            ))}
          </>
        )}
      </Flex>
      {!isLoading && (
        <Pagination
          className="mt-8"
          align="center"
          pageSize={BOOK_ITEM_PER_PAGE}
          defaultCurrent={1}
          current={currentPage}
          total={totalItems}
          showSizeChanger={false}
          onChange={(current) => goPage(current)}
        />
      )}
    </Flex>
  );
};

export default BookList;
