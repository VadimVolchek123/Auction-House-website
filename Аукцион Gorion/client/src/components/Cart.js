import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { fetchCartItems, payForCart } from "../http/cartAPI";
import { Context } from "../index";
import { runInAction } from "mobx";

const Cart = () => {
  const { user } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const loadCartItems = async () => {
      setLoading(true);
      setError("");
      try {
        const items = await fetchCartItems();
        setCartItems(items || []);
      } catch (err) {
        console.error("Ошибка загрузки корзины:", err);
        setError("Ошибка загрузки корзины.");
      } finally {
        setLoading(false);
      }
    };
    loadCartItems();
  }, []);

  // Функция для оплаты всей корзины
  const handlePayForCart = async () => {
    try {
      const data = await payForCart();
      console.log("Результат оплаты:", data);
      
      // Обновляем баланс пользователя
      runInAction(() => {
        user.setUser({
          ...user.user,
          balance: data.balance
        });
      });
      
      // Обновляем состояние корзины: для всех товаров, которые ожидали оплаты, устанавливаем paymentStatus = "paid"
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.paymentStatus !== "paid" ? { ...item, paymentStatus: "paid" } : item
        )
      );
    } catch (err) {
      console.error("Ошибка при оплате корзины:", err);
      alert("Не удалось провести оплату.");
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" className="mt-3" />;
  }
  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }
  if (cartItems.length === 0) {
    return (
      <Alert variant="info" className="mt-3">
        Вы ещё не приобрели никаких товаров.
      </Alert>
    );
  }

  // Отбираем товары, ожидающие оплаты (где paymentStatus !== "paid")
  const pendingItems = cartItems.filter(item => item.paymentStatus !== "paid");

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Выигранные аукционы</h2>
      <Row>
        {cartItems.map((item) => {
          const auction = item.auction;
          const product = auction && auction.product ? auction.product : null;
          const productImage =
            product && product.img
              ? `${baseUrl}/${product.img}`
              : "fallback-image.jpg";
          return (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={productImage} alt={product ? product.name : "Товар"} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product ? product.name : "Неизвестный товар"}</Card.Title>
                  <Card.Text>Цена: {item.totalAmount} руб.</Card.Text>
                  {item.paymentStatus === "paid" ? (
                    <Alert variant="success" className="mt-2 p-1">Оплачено</Alert>
                  ) : (
                    <Alert variant="warning" className="mt-2 p-1">Ожидает оплаты</Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      
      {/* Кнопка оплаты отображается только если есть товары, ожидающие оплаты */}
      {pendingItems.length > 0 && (
        <div className="text-center mt-4">
          <Button variant="primary" onClick={handlePayForCart}>
            Оплатить всю корзину
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;
