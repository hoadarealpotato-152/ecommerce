import { Card, Flex } from "antd";
import { formatPrice } from "../../utils/priceFormat";

import { StarFilled } from '@ant-design/icons'
import { CategoryTag } from "../category/CategoryTag";

interface IBookCardProps {
    book_title: string,
    category: string,
    author: string,
    book_image: string,
    original_price: number,
    sale_price: number,
    ratings: number,
    total_reviews: number
    onClick: () => void,
}

const BookCard = (props: IBookCardProps) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<div className="size-60"><img className="object-contain h-60 mx-auto" alt="book-img" src={props.book_image} /></div>}
            className="border-2"
            onClick={props.onClick}
        >
            <CategoryTag tagName={props.category} />
            <Card.Meta title={props.book_title} />
            <Flex vertical gap={4} className="mt-1 text-sm text-black-2">
                <p className="line-clamp-1">{props.author}</p>
                <p>{formatPrice(props.original_price)}</p>
                <Flex justify="space-between">
                    <p><StarFilled className="text-soft-red mr-1" />{props.ratings}</p>
                    <p>{props.total_reviews} đánh giá</p>
                </Flex>
            </Flex>

        </Card>
    );
}

export default BookCard;