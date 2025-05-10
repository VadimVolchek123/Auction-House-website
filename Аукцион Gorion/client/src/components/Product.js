import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { Context } from '../index'; // Импортируем глобальный контекст

const Product = ({ product }) => {
  // Получаем userId из контекста
  const { user } = useContext(Context);
  const userId = user?.id;
  console.log("User ID:", userId);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const productImage = product.img ? `${baseUrl}/${product.img}` : 'fallback-image.jpg';

  // Определяем, какой ID использовать для ссылки на аукцион:
  const auctionId = product.auction && (product.auction.id || product.id);
  console.log("Auction ID to pass:", auctionId);

  // Формируем URL для страницы аукциона, добавляя userId в query-параметры
  const auctionLink = auctionId ? `/auction/${auctionId}${userId ? `?userId=${userId}` : ''}` : null;

  return auctionLink ? (
    <Link to={auctionLink} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="mb-3" style={{ cursor: 'pointer' }}>
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
            <Card.Text>Этот продукт не участвует в аукционе.</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Link>
  ) : (
    <Card className="mb-3">
      <Image src={productImage} alt={product.name} fluid />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>Этот продукт не участвует в аукционе.</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
