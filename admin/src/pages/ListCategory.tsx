import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Table,
  Row,
  Col,
  Modal,
  message,
  Pagination,
  Input,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import FormCategory from "./FormCategory";
import { TCategoryListItem } from "../types/category";

interface Category {
  category_id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface searchParams {
  totalItem: number;
  currentPage: number;
  searchKey: string;
}

interface TableBaseProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  handleToggleEdit: (category: Category) => void;
}

const TableBase: React.FC<TableBaseProps> = ({
  categories,
  handleToggleEdit,
}) => {
  const columns = [
    {
      title: "Tên danh mục sách",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian tạo",
      key: "created_at",
      render: (_: any, record: any) => {
        return <>{new Date(record.createdAt).toLocaleDateString()}</>;
      },
    },
    {
      title: "Thời gian cập nhật",
      key: "updated_at",
      render: (_: any, record: any) => {
        return <>{new Date(record.updatedAt).toLocaleDateString()}</>;
      },
    },
    {
      title: "Chỉnh Sửa",
      key: "action",
      render: (category: TCategoryListItem) => {
        const toggleEdit = () => {
          handleToggleEdit({
            category_id: category.categoryId,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          });
        };
        return (
          <span>
            <EditOutlined key="edit" onClick={toggleEdit} />
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={categories} pagination={false} />
    </>
  );
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<searchParams>({
    totalItem: 10,
    currentPage: 1,
    searchKey: "",
  });

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [search, setSearch] = useState<string>("");

  const [category, setCategory] = useState<Category>({
    category_id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleSaveCategory = async (values: Category) => {
    try {
      if (isEditingCategory) {
        await fetch(
          `http://10.63.164.67:6969/api/v1/admin/categories/${category.category_id}`,
          {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ name: values.name }),
          }
        );
        message.success("cap nhat thanh cong");
        fetchCategories(1);
      } else {
        await fetch(`http://10.63.164.67:6969/api/v1/admin/categories`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ name: values.name }),
        });
        message.success("tao moi danh muc thanh cong");
        fetchCategories(1);
      }
    } catch (error) {
      alert("Lưu không thành công!");
    }
  };

  const onSearch = async () => {
    fetchCategories(1, search);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showCreateModal = () => {
    setIsEditingCategory(false);
    setCategory({
      category_id: "",
      name: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: "",
    });
    showModal();
  };

  const showEditModal = (category: Category): void => {
    setIsEditingCategory(true);
    setCategory({ ...category });
    showModal();
  };

  const handleOk = () => {
    handleSaveCategory(category);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangeCategory = (value: Partial<Category>): void => {
    setCategory({ ...category, ...value });
  };

  const fetchCategories = async (pageNo: number, searchValue?: string) => {
    const searchKey = searchValue ? searchValue : searchParams.searchKey;

    try {
      if (searchValue == "" || searchValue == undefined) {
        const url = `http://10.63.164.67:6969/api/v1/admin/categories?pageNo=${pageNo}&pageSize=10`;
        const response = await fetch(url);
        const { data } = await response.json();
        setCategories(data.content);
        setSearchParams({
          totalItem: data.metadata.totalElements,
          currentPage: pageNo,
          searchKey: searchKey,
        });
      } else {
        const url = searchKey
          ? `http://10.63.164.67:6969/api/v1/admin/categories/search?keyword=${searchKey}&pageNo=${pageNo}&pageSize=10`
          : `http://10.63.164.67:6969/api/v1/admin/categories?pageNo=${pageNo}&pageSize=10`;
        const response = await fetch(url);
        const { data } = await response.json();
        setCategories(data.content);
        setSearchParams({
          totalItem: data.metadata.totalElements,
          currentPage: pageNo,
          searchKey: searchKey,
        });
      }
    } catch (error) {
      console.error("Error fetch data:", error);
    }
  };

  const handleChangePage = (page: number) => {
    fetchCategories(page);
  };

  const title = useMemo(() => {
    return isEditingCategory ? "Chỉnh sửa Danh mục" : "Tạo mới danh mục";
  }, [isEditingCategory]);

  useEffect(() => {
    fetchCategories(1);
  }, []);

  return (
    <>
      <Row
        justify="center"
        align="bottom"
        className="flex justify-between mb-4"
      >
        <Col offset={1}>
          <Button
            type="primary"
            size="middle"
            onClick={showCreateModal}
            className="bg-soft-red text-white"
          >
            Tạo danh mục mới
          </Button>
        </Col>

        <Col pull={1}>
          <Row>
            <Col>
              <Input
                value={search}
                type="text"
                placeholder="Search"
                maxLength={50}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                onClick={onSearch}
                type="primary"
                className="bg-soft-red text-white"
              >
                Search
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={22}>
          <TableBase
            categories={categories}
            setCategories={setCategories}
            handleToggleEdit={showEditModal}
          />
        </Col>
      </Row>
      <Pagination
        className="mt-4 flex justify-center"
        current={searchParams.currentPage}
        total={searchParams.totalItem}
        pageSize={10}
        onChange={handleChangePage}
      />
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <FormCategory
          isEditMode={isEditingCategory}
          category={category}
          handleChangeCategory={handleChangeCategory}
        />
      </Modal>
    </>
  );
};

export default CategoryList;
