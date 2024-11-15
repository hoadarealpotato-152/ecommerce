import { CheckCircleOutlined } from "@ant-design/icons";
import { Col, Flex, Progress, Rate, Row, Typography, Card, Space } from "antd";

const { Title, Text } = Typography;
const ratings = [
  { stars: 5, percentage: 10 },
  { stars: 4, percentage: 10 },
  { stars: 3, percentage: 50 },
  { stars: 2, percentage: 20 },
  { stars: 1, percentage: 10 },
];

const review = {
  author: "Bùi Thị Thanh Nhàn",
  date: "22:04, 30/10/2024",
  content:
    "Chất lượng sản phẩm tuyệt vời! Đóng gói sản phẩm rất đẹp và chắc chắn. Rất đáng tiền.",
  rating: 5,
  verified: true,
};

const BookReview = () => {
  return (
    <Flex vertical className="p-1">
      <h1 className="text-xl font-bold">Đánh giá sản phẩm</h1>
      <Col></Col>
      <Row>
        <Col className="text-center">
          <Row className="mx-14 mt-2">
            <Title level={1}>
              3<small className="text-lg">/5</small>
            </Title>
          </Row>
          <Row className="mx-2">
            <Rate disabled value={3.5} />
          </Row>
          <Row className="mx-8">
            <Text type="secondary">(100 đánh giá)</Text>
          </Row>
        </Col>
        <Col offset={1} span={6}>
          {ratings.map((rating) => (
            <Row key={rating.stars}>
              <Col span={3}>
                <Text>{rating.stars} sao</Text>
              </Col>
              <Col span={17}>
                <Progress percent={rating.percentage} showInfo={false} />
              </Col>
              <Col span={3} offset={1}>
                <Text>{rating.percentage}%</Text>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      <Row className="mt-10">
        <Card>
          <Space direction="vertical" size="small">
            <Space align="center">
              <Rate disabled value={review.rating} />
              <Text strong>{review.author}</Text>
              <Text type="secondary">{review.date}</Text>
            </Space>
            {review.verified && (
              <Space align="center">
                <CheckCircleOutlined style={{ color: "green" }} />
                <Text style={{ color: "green" }}>Đã mua hàng</Text>
              </Space>
            )}
            <Text>{review.content}</Text>
          </Space>
        </Card>
      </Row>
    </Flex>
  );
};

export default BookReview;
