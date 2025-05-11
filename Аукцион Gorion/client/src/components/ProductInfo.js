import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const ProductInfo = ({ product }) => {
  if (!product) {
    return <div>Продукт не найден.</div>;
  }

  // Деструктуризация полей продукта: name, description, img, price, additionalInfo
  const { name, description, img, price, additionalInfo } = product;
  
  // Базовый URL для загрузки картинок (если используете)
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const productImage = img ? `${baseUrl}/${img}` : "placeholder.jpg";

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={productImage} alt={name} />
          </Card>
        </Col>
        <Col md={6}>
          <h1>{name}</h1>
          <h2>Дополнительная информация: </h2>
          <p>{description}</p>
          {price && <h4>Цена: {price} руб.</h4>}
          {additionalInfo && additionalInfo.length > 0 && (
            <div>
              <h5>Дополнительная информация:</h5>
              <ul>
                {additionalInfo.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductInfo;
