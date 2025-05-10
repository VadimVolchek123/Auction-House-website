import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { Context } from '../index'; // Глобальный контекст

const Product = ({ product }) => {
  // Получаем userId из контекста
  const { user } = useContext(Context);
  const userId = user?.id;
  console.log("User ID:", userId);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const productImage = product.img ? `${baseUrl}/${product.img}` : 'fallback-image.jpg';

  // Если у продукта есть поле auction с id – считаем, что он участвует в аукционе
  const auctionExists = product.auction && product.auction.id;

  // Если аукцион существует - переходим на страницу аукциона, иначе - на страницу продукта (ProductPage)
  const linkTo = auctionExists 
    ? `/auction/${product.auction.id}${userId ? `?userId=${userId}` : ''}` 
    : `/product/${product.id}`;

  return (
    <Link to={linkTo} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="mb-3" style={{ cursor: 'pointer' }}>
        <Image src={productImage} alt={product.name} fluid />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          {auctionExists && (
            <Card.Text>
              <strong>Аукцион:</strong> Стартовая цена {product.auction.startingPrice}$
              <br />
              <strong>Начало:</strong> {new Date(product.auction.startTime).toLocaleString()}
              <br />
              <strong>Конец:</strong> {new Date(product.auction.endTime).toLocaleString()}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Product;
