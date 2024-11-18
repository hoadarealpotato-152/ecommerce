import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { TCategoryListItem } from '../../types/category';
import { getCategoryList } from '../../api/categories';
import { CategoryTag } from '../category/CategoryTag';
import { TBookListReturn } from '../../types/book';
import { useDispatch } from 'react-redux';
import { updateBookState } from '../../store/book/bookSlice';
import { getProductsList } from '../../api/products';
import { DownCircleOutlined } from '@ant-design/icons';

const CategoryList = () => {
  const [categories, setCategories] = useState<TCategoryListItem[]>([]);

  const dispatch = useDispatch();

  const getCategories = async () => {
    try {
      const response = await getCategoryList({ pageNo: 1, pageSize: 10 });
      if (response) {
        setCategories(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const handleFilterByCategory = async (categoryId: string) => {
    try {
      const data: TBookListReturn | null = await getProductsList({
        categories: [categoryId],
      });
      if (data) {
        dispatch(
          updateBookState({
            bookList: data.books,
            searchValue: categoryId,
          })
        );
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex vertical gap={8} className='px-2 py-4 w-auto'>
      <h1 className='text-2xl font-bold'>Danh mục sản phẩm</h1>
      <Flex vertical className='px-2 py-4 bg-white' wrap>
        {categories.map((category) => (
          <p
            className='cursor-pointer text-xl hover:text-soft-red'
            onClick={() => handleFilterByCategory(category.categoryId)}
          >
            {category.name}
          </p>
        ))}
      </Flex>
      <p className='w-full text-center cursor-pointer text-blue hover:font-bold'>
        Xem thêm <DownCircleOutlined />
      </p>
    </Flex>
  );
};

export default CategoryList;
