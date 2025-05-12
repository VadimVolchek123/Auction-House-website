import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { Context } from '../index'; // Глобальный контекст

const ProductUser = ({ product }) => {
  // Получаем userId из контекста
  const { user } = useContext(Context);
  const userId = user?.id;
  console.log("User ID:", userId);
  console.log("Product image property:", product.img);

  // Базовый URL сервера; убедитесь, что переменная окружения установлена
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Если ваши картинки лежат в директории /images на сервере, используйте:
  const productImage = product.img
    ? `${baseUrl}/images/${product.img}`
    : '/fallback-image.jpg'; // fallback-изображение должно располагаться в папке public

  // Если же product.img уже содержит корректный путь,
  // можно использовать просто `${baseUrl}/${product.img}`

  // Если у продукта есть поле auction с id – считаем, что он участвует в аукционе
  const auctionExists = product.auction && product.auction.id;

  // Формируем URL перехода: если аукцион существует - переход на страницу аукциона, иначе - на страницу продукта
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

export default ProductUser;
