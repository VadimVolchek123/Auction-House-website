import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Context } from "../index";
import { fetchProductsWithoutAuctionBySeller } from "../http/productAPI";
import ProductUserList from "../components/ProductUserList";
import { observer } from "mobx-react-lite";

const UserProductsWithoutAuction = observer(() => {
  // Получаем данные пользователя из контекста
  const { user } = useContext(Context);

  // Локальные состояния для списка товаров, общего количества и индикаторов загрузки/ошибок
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Задаём параметры для получения ВСЕХ товаров
  const page = 1;
  const limit = 1000; // высокий лимит для получения всех товаров

  if (!user) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div>Загрузка пользователя...</div>
      </Container>
    );
  }
  
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
        const { productsWithoutAuction, count } = await fetchProductsWithoutAuctionBySeller(
          user._id,
          page,
          limit
        );
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
            // Оборачиваем список товаров в контейнер с горизонтальной прокруткой и отключенным переносом
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                overflowX: "auto",
                paddingBottom: "1rem"
              }}
            >
              <ProductUserList products={products} />
            </div>
          )}
          <p>Всего товаров: {count}</p>
        </Col>
      </Row>
    </Container>
  );
});

export default UserProductsWithoutAuction;
