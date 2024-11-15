import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Flex,
  notification,
} from "antd";
import SingleImageUploader from "./SingleImageUploader";
import MultipleImageUploader from "./MuiltipleImageUploader";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hook/hook";
import { formImageSelector } from "../../store/image/imageSlice";
import { getCategoryList } from "../../api/categories";
import {
  findCategoryIdByName,
  getCategoryNameList,
} from "../../utils/categoryUtils";
import { TCategoryListItem } from "../../types/category";
import { TCreateProductBody } from "../../types/book";
import { createProduct } from "../../api/products";
import PriceInput from "./PriceInput";
import { checkPrice } from "../../utils/checkPrice";
import { handleKeyPress } from "../../utils/inputValidation";

const { TextArea } = Input;

type NotificationType = "success" | "info" | "warning" | "error";

const CreateProductForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<TCategoryListItem[]>([]);
  const imagesStore = useAppSelector(formImageSelector);

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

  const handleSubmitForm = async () => {
    const formData: TCreateProductBody = {
      title: form.getFieldValue("title"),
      thumbnail: imagesStore.thumbnail,
      description: form.getFieldValue("description"),
      quantity: form.getFieldValue("stock_quantity"),
      publisher: {
        name: form.getFieldValue("publisher"),
      },
      authors: [
        {
          name: form.getFieldValue("author"),
          authorId: "fsadfdasfsafasfas",
        },
      ],
      images: imagesStore.descriptionImages,
      categories: [
        {
          categoryId: findCategoryIdByName(
            form.getFieldValue("category"),
            categories
          ),
          name: form.getFieldValue("category"),
        },
      ],
      properties: [
        {
          propertyId: "fdsafasfadsfads",
          name: "Ngôn ngữ",
          value: form.getFieldValue("language"),
        },
        {
          propertyId: "asdfasdfdasff",
          name: "Số trang",
          value: form.getFieldValue("book_number"),
        },
      ],
      price: {
        basePrice: form.getFieldValue("base_price"),
        discountPrice: form.getFieldValue("discount_price"),
      },
    };
    try {
      console.log(formData);
      const response = await createProduct(formData);
      if (response) {
        openCreateProductNotification(
          "success",
          "Thành Công",
          "Tạo mới sản phẩm thành công"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openCreateProductNotification = (
    type: NotificationType,
    status: string,
    message: string
  ) => {
    api[type]({
      message: status,
      description: message,
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {contextHolder}
      <Flex vertical gap={32} justify="center">
        <h1 className="text-4xl text-center font-bold">Tạo loại sách mới</h1>
        <Form
          form={form}
          name="createProductForm"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          autoComplete="off"
          variant="filled"
          onFinish={handleSubmitForm}
        >
          <Form.Item
            label="Tên sách"
            name="title"
            rules={[
              { required: true, message: "Tên sách không được bỏ trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Hình đại diện" name="image">
            <SingleImageUploader />
          </Form.Item>
          <Form.Item
            label="Tác giả"
            name="author"
            rules={[
              { required: true, message: "Tác giả không được bỏ trống!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thể loại"
            name="category"
            rules={[
              { required: true, message: "Thể loại không được bỏ trống!" },
            ]}
          >
            <Select
              defaultValue={getCategoryNameList(categories).at(0)?.label}
              style={{ width: "100%" }}
              options={getCategoryNameList(categories)}
            />
          </Form.Item>
          <Form.Item label="Nhà xuất bản" name="publisher">
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="stock_quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng !" }]}
          >
            <InputNumber
              onKeyDown={(e) => handleKeyPress(e)}
              className="w-full"
              pattern="[0-9]*"
            />
          </Form.Item>
          <Form.Item
            label="Mô tả sách"
            name="description"
            rules={[{ required: true, message: "Mô tả không được bỏ trống!" }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Ngôn ngữ"
            name="language"
            rules={[
              { required: true, message: "Ngôn ngữ không được bỏ trống!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số trang"
            name="book_number"
            rules={[
              { required: true, message: "Số trang không được bỏ trống!" },
            ]}
          >
            <InputNumber
              onKeyDown={(e) => handleKeyPress(e)}
              className="w-full"
              pattern="[0-9]*"
            />
          </Form.Item>
          <Form.Item
            label="Giá gốc"
            name="base_price"
            rules={[
              { required: true, message: "Giá gốc không được bỏ trống!" },
              { validator: checkPrice, message: "Số tiền phải lớn hơn 0" },
            ]}
          >
            <PriceInput id="base-price-input" />
          </Form.Item>
          <Form.Item
            label="Giá giảm"
            name="discount_price"
            rules={[
              { required: true, message: "Giá giảm không được bỏ trống!" },
              { validator: checkPrice, message: "Số tiền phải lớn hơn 0" },
            ]}
          >
            <PriceInput id="discount-price-input" />
          </Form.Item>
          <Form.Item label="Hình sản phẩm" name="image_list">
            <MultipleImageUploader />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
};

export default CreateProductForm;
