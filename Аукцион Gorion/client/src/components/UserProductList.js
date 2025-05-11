import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Context } from "../index";
import { fetchProductsWithoutAuctionBySeller } from "../http/productAPI";
import ProductL from "../components/ProductL";
import { observer } from "mobx-react-lite";

const UserProductsWithoutAuction = observer(() => {
  // Получаем данные пользователя из контекста
  const { user } = useContext(Context);

  // Локальные состояния для списка товаров, общего количества и индикаторов загрузки/ошибок
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Параметры пагинации
  const page = 1;
  const limit = 5;
  
  console.log("Контекст пользователя (ID):", user);
    
  // Если данные пользователя ещё не загружены — показываем индикатор загрузки
  if (!user) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div>Загрузка пользователя...</div>
      </Container>
    );
  }
  
  // Проверяем наличие идентификатора пользователя
  if (!user._id) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Пользователь не авторизован.</Alert>
      </Container>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Используем _id пользователя как sellerId
        const { productsWithoutAuction, count } = await fetchProductsWithoutAuctionBySeller(user._id, page, limit);
        setProducts(productsWithoutAuction);
        setCount(count);
      } catch (err) {
        console.error("Ошибка загрузки продуктов:", err);
        setError("Ошибка загрузки продуктов.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div>Загрузка продуктов...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h2>Мои товары</h2>
          {products.length === 0 ? (
            <Alert variant="info">Нет товаров для отображения.</Alert>
          ) : (
            <ProductL products={products} />
          )}
          <p>Всего товаров: {count}</p>
        </Col>
      </Row>
    </Container>
  );
});

export default UserProductsWithoutAuction;
