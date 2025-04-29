import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

const Product = ({ product }) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const productImage = product.img ? `${baseUrl}/${product.img}` : 'fallback-image.jpg';

    return (
        <Card className="mb-3">
            <Image src={productImage} alt={product.name} fluid />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                {product.auction ? (
                    <Card.Text>
                        <strong>Аукцион:</strong> Стартовая цена {product.auction.startingPrice}$
                        <br />
                        <strong>Начало:</strong> {new Date(product.auction.startTime).toLocaleString()}
                        <br />
                        <strong>Конец:</strong> {new Date(product.auction.endTime).toLocaleString()}
                    </Card.Text>
                ) : (
                    <Card.Text>
                        Этот продукт не участвует в аукционе.
                    </Card.Text>
                )}
            </Card.Body>
        </Card>
    );
};

export default Product;
