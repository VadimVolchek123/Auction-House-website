import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();

  if (!product) {
    return <div>Продукт не найден.</div>;
  }

  // Деструктуризация полей продукта, включая id, который потребуется для удаления
  const { id, name, description, img, price, additionalInfo } = product;
  
  // Базовый URL для загрузки картинок (если используется)
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const productImage = img ? `${baseUrl}/${img}` : "placeholder.jpg";

  // Функция для удаления товара
  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        const response = await fetch(`${baseUrl}/api/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Продукт успешно удален.");
          // После удаления можно перейти к списку товаров или на главную страницу
          navigate("/products");
        } else {
          alert("Ошибка удаления продукта.");
        }
      } catch (error) {
        console.error("Ошибка при удалении товара:", error);
        alert("Ошибка удаления продукта.");
      }
    }
  };

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
          <h2>Описание:</h2>
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
          {/* Кнопка удаления */}
          <Button variant="danger" onClick={handleDelete} className="mt-3">
            Удалить товар
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductInfo;
