import { Checkbox, Flex, Select, SelectProps } from 'antd';
import { formatPrice } from '../../utils/priceFormat';

const Filter = () => {
  const handleChange = () => {};

  const categoryOptions: SelectProps['options'] = [];

  const priceOptions = [
    { label: `< ${formatPrice(100000)}`, value: '100000' },
    {
      label: `${formatPrice(100000)} - ${formatPrice(500000)}`,
      value: '500000',
    },
    { label: `> ${formatPrice(500000)}`, value: '501000' },
  ];

  return (
    <Flex vertical className='w-1/5 h-auto shadow-md px-4'>
      <p>Lọc theo thể loại</p>
      <Select
        mode='multiple'
        allowClear
        className='w-full h-12'
        placeholder='Chọn thể loại'
        defaultValue={[]}
        onChange={handleChange}
        options={categoryOptions}
      />
      <p>Chọn khoảng giá</p>
      <Checkbox.Group
        options={priceOptions}
        defaultValue={['Apple']}
        onChange={() => {}}
      />
    </Flex>
  );
};

export default Filter;
