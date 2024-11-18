import { Flex } from 'antd';
import BookList from '../components/book/BookList';
import Filter from '../components/filter/Filter';
function Home() {
  return (
    <Flex>
      <Filter />
      <BookList />
    </Flex>
  );
}

export default Home;
