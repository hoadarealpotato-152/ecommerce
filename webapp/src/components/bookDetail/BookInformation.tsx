import { Flex, InputNumber, Rate, Table } from "antd";
import { formatPrice } from "../../utils/priceFormat";
import { useState } from "react";
import { TBookDetail, TProperty } from "../../types/book";

interface IBookInformationProps {
  bookInformation: Partial<TBookDetail>;
  purchaseQuantity: number;
  handleChangeQuantity: (quantity: number) => void;
}

type TPropertyObject = {
  propName: string;
  propValue: string | undefined;
};

const { Column } = Table;

const BookInformation = (props: IBookInformationProps) => {
  const { purchaseQuantity, handleChangeQuantity } = props;

  const addAmountButton = (
    <button
      className="cursor-pointer"
      onClick={() => handleChangeQuantity(purchaseQuantity + 1)}
    >
      +
    </button>
  );

  const minusAmountButton = (
    <button
      className="cursor-pointer disabled:cursor-not-allowed"
      onClick={() => handleChangeQuantity(purchaseQuantity - 1)}
      disabled={purchaseQuantity < 2}
    >
      -
    </button>
  );

  const handleChange = (value: number | null) => {
    handleChangeQuantity(value || 1);
  };

  const data = [
    {
      propName: "Nhà xuất bản",
      propValue: props.bookInformation.publisher?.name,
    },
    {
      propName: "Tác giả",
      propValue: props.bookInformation.authors?.at(0)?.name,
    },
  ];

  const appendProperties = (
    data: TPropertyObject[] | undefined,
    properties: TProperty[] | undefined
  ) => {
    if (!data || !properties) {
      return;
    }
    properties.forEach((property) => {
      const newProperty: TPropertyObject = {
        propName: property.name,
        propValue: property.value,
      };
      data.push(newProperty);
    });
    return data;
  };

  return (
    <Flex vertical gap={8}>
      <Flex vertical className="size-auto rounded-lg border-grey border-2 p-4">
        <h1 className="text-md font-bold">{props.bookInformation.title}</h1>
        <Flex className="text-xs">
          <Flex justify="space-between" className="w-full">
            <p>
              Nhà cung cấp:{" "}
              <strong>{props.bookInformation.publisher?.name}</strong>
            </p>
            <p>
              Tác giả:{" "}
              <strong>{props.bookInformation.authors?.at(0)?.name}</strong>
            </p>
          </Flex>
        </Flex>
        <Flex className="text-xs">
          <Rate disabled defaultValue={props.bookInformation.averageRating} />
          <p>{`(${props.bookInformation.totalReviewsCount} đánh giá) | Đã bán ${props.bookInformation.totalSalesCount}`}</p>
        </Flex>
        <Flex gap={8}>
          <h1 className="text-soft-red font-bold">
            {formatPrice(
              props.bookInformation.price
                ? props.bookInformation.price?.basePrice -
                    props.bookInformation.price?.discountPrice
                : 0
            )}
          </h1>
          <p className="text-xs text-grey line-through">
            {formatPrice(
              props.bookInformation.price
                ? props.bookInformation.price?.basePrice
                : 0
            )}
          </p>
        </Flex>
      </Flex>
      <Flex
        vertical
        gap={8}
        className="size-auto rounded-lg text-xs border-grey border-2 p-4"
      >
        <h1 className="text-sm font-bold">Thông tin vận chuyển</h1>
        <Flex gap={8}>
          <p>Giao hàng đến: Landmark 72</p>
          <p className="text-blue cursor-pointer font-bold">Thay đổi</p>
        </Flex>
        <Flex gap={8} align="center">
          <p>Số lượng</p>
          <InputNumber
            className="[&::-webkit-inner-spin-button]:appearance-none w-28"
            controls={false}
            min={1}
            defaultValue={1}
            value={purchaseQuantity}
            addonBefore={minusAmountButton}
            addonAfter={addAmountButton}
            onChange={(val: number | null) => handleChange(val)}
            changeOnBlur={true}
          />
        </Flex>
      </Flex>
      <Flex
        vertical
        className="size-auto rounded-lg text-sm border-grey border-2 p-4"
      >
        <h1 className="text-md font-bold">Thông tin chi tiết</h1>
        <Table
          dataSource={appendProperties(data, props.bookInformation.properties)}
          pagination={false}
          showHeader={false}
        >
          <Column
            className="text-xs text-grey"
            dataIndex="propName"
            key="propName"
          />
          <Column className="text-xs" dataIndex="propValue" key="propValue" />
        </Table>
      </Flex>
    </Flex>
  );
};

export default BookInformation;
