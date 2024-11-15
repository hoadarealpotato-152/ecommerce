import React, { ReactNode, useEffect, useState } from 'react';
import { Avatar, Button, Col, Popover, Row, Select, Table } from 'antd';
import { GetProps, Input, TableColumnsType } from 'antd';
import { CheckCircleTwoTone, MinusCircleTwoTone, SearchOutlined, StopTwoTone, UserOutlined } from '@ant-design/icons';
import api from '../api/apiConfig';
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

interface DataType {
    accountId: string;
    fullname: string;
    username: string;
    email: string;
    avatar: string;
    joinDate: string;
    status: string;
    updatedDate: string;
    action: ReactNode;
}

interface MetaData {
    limit: number;
    offSet: number;
    totalElements: number;
}

const columns: TableColumnsType = [
    Table.SELECTION_COLUMN,
    { title: 'Họ và tên', dataIndex: 'fullname', key: 'fullname' },
    Table.EXPAND_COLUMN,
    { title: 'Avatar', dataIndex: 'avatar', key: 'avatar' },
    { title: 'Tên tài khoản', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Ngày đăng ký', dataIndex: 'joinDate', key: 'joinDate' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Cập nhật cuối', dataIndex: 'updatedDate', key: 'updatedDate' },
    { title: 'Thao tác', dataIndex: 'action', key: 'action' },
];
const activeContent = (
    <div>
        <p>Kích hoạt tài khoản</p>
    </div>
);
const deactiveContent = (
    <div>
        <p>Khóa tài khoản</p>
    </div>
);
const bannedContent = (
    <div>
        <p>Ban tài khoản</p>
    </div>
);

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const ListCustomer: React.FC = () => {
    const [keyword, setKeyword] = useState<string>('');
    const [data, setData] = useState<DataType[]>([]);
    const [metaData, setMetaData] = useState<MetaData>({ limit: 10, offSet: 0, totalElements: 10 });
    const [loading, setLoading] = useState<boolean>(false);
    const [sortRequest, setSortRequest] = useState<string>('');
    const [filterRequest, setFilterRequest] = useState<string>('');
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const fetchCustomers = async (
        keyword: string,
        sortRequest: string,
        filterRequest: string,
        pageNo: number,
        pageSize: number

    ) => {
        setLoading(true);
        try {
            const response = await api.post('/v1/admin/accounts/search',
                {
                    keyword: keyword,
                    sortRequest: sortRequest,
                    filterRequest: filterRequest,
                    pageNo: (pageNo-1),
                    pageSize: pageSize
                });
            console.log(pageNo);
            console.log(pageSize);
            console.log(response)
            const { data } = response.data;
            setMetaData(data.metaData);
            setTotal(data.metaData.totalElements);
            console.log('meta: ' + metaData?.limit + metaData?.offSet + metaData?.totalElements);
            const customers = data.content.map((customer: any) => ({
                accountId: customer.accountId,
                fullname: customer.fullname,
                username: customer.username,
                email: customer.email,
                avatar: (<Avatar src={customer.avatar} icon={<UserOutlined />}></Avatar>),
                joinDate: customer.joinDate,
                status: (customer.status==='ACTIVE'? <div className='bold text-[#52c41a]'>HOẠT ĐỘNG</div> : (customer.status==='PENDING'? <div className='bold text-[#FCA510]'>CHƯA KÍCH HOẠT</div> : (customer.status==='BANNED'? <div className='bold text-[#FF0000]'>BỊ KHÓA</div> :<div>{customer.status}</div>))),
                updatedDate: customer.updatedDate,
                action: (
                    <div>
                        <Popover content={activeContent}>
                            <a className='mr-4'>
                                <CheckCircleTwoTone key="active" twoToneColor="#52c41a" />
                            </a>
                        </Popover>
                        <Popover content={deactiveContent}>
                            <a className='mr-4'>
                                <MinusCircleTwoTone key="deactive" twoToneColor="#FF0000" />
                            </a>
                        </Popover>
                        <Popover content={bannedContent}>
                            <a>
                                <StopTwoTone key="banned" twoToneColor="#FCA510" />
                            </a>
                        </Popover>
                    </div>
                ),
            }));
            console.log(customers)
            setData(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchCustomers(keyword, sortRequest, filterRequest, pageNo, pageSize);
        setPageNo(1);
    };

    useEffect(() => {
        fetchCustomers(keyword, sortRequest, filterRequest, pageNo, pageSize);
    }, [keyword, sortRequest, filterRequest, pageNo, pageSize]);

    const handleTableChange = (pagination: any) => {
        setPageNo(pagination.current);
        setPageSize(pagination.pageSize);
    }

    return (
        <div>
            <Row className='justify-end m-6'>
                <Col pull={1} className="flex mr-3">
                    <Select>
                    </Select>
                </Col>
                <Col pull={1} className="flex">
                    <Input value={keyword} type='text' placeholder='Tìm kiếm' onChange={(e) => setKeyword(e.target.value)} />
                    <Button onClick={() => handleSearch} className='bg-soft-red text-white border-soft-red'><SearchOutlined /></Button>
                </Col>
            </Row >
            <Table
                className='m-5'
                columns={columns}
                rowKey='accountId'
                rowSelection={{}}
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.email}</p>,
                }}
                dataSource={data}
                pagination={{
                    current: pageNo,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['10','20','50','100'],
                }}
                onChange={handleTableChange}
            />
        </div>

    )
};

export default ListCustomer;