import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Context } from "../index";
import { fetchProductsWithoutAuctionBySeller } from "../http/productAPI";
import ProductL from "../components/ProductL";

const UserProductsWithoutAuction = () => {
  // Получаем пользователя из контекста (предполагается, что пользователь залогинен)
  const { user } = useContext(Context);
  
  // Локальное состояние для хранения списка товаров, общего количества, индикаторов загрузки и ошибок
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Параметры пагинации (при необходимости можно вынести в глобальное состояние)
  const page = 1;
  const limit = 5;
  
  useEffect(() => {
    console.log("Контекст пользователя:", user); // Отладочный вывод
    const fetchData = async () => {
      try {
        if (!user || !user.id) {
          setError("Пользователь не авторизован.");
          return;
        }
        // Используем id пользователя как sellerId
        const { productsWithoutAuction, count } = await fetchProductsWithoutAuctionBySeller(user.id, page, limit);
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
  }, [user]); // Обновляется при изменении пользователя

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
          <h2>Мои товары без аукционов</h2>
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
};

export default UserProductsWithoutAuction;
