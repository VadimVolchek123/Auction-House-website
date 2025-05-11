import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { fetchCartItems } from "../http/cartAPI";
import { Context } from "../index";
import { runInAction } from "mobx";
import { $authHost } from "../http/index";

const Cart = () => {
  const { user } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [paidItems, setPaidItems] = useState([]); // Хранение id оплаченных товаров
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  // Функция обработки оплаты для конкретного товара
  const handlePay = async (itemId, amount) => {
    const currentBalance = Number(user.balance || 0);
    console.log("Текущий баланс:", currentBalance, "Цена товара:", amount);
    
    if (currentBalance < amount) {
      alert("Недостаточно средств на балансе для оплаты.");
      return;
    }
    
    try {
      const updatedData = await $authHost.post('api/user/pay', { itemId, amount });
      console.log("Ответ от API (processPayment):", updatedData);
  
      runInAction(() => {
        user.setUser({
          ...user.user,
          balance: updatedData.balance
        });
        setPaidItems((prev) => [...prev, itemId]);
      });
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      alert("Не удалось обработать оплату.");
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
              : 'fallback-image.jpg';

          return (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={productImage} alt={product ? product.name : "Товар"} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product ? product.name : "Неизвестный товар"}</Card.Title>
                  <Card.Text>Цена: {item.totalAmount} руб.</Card.Text>
                  {paidItems.includes(item.id) ? (
                    <Alert variant="success" className="mt-2 p-1">Оплачено</Alert>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="mt-2"
                      onClick={() => handlePay(item.id, item.totalAmount)}
                    >
                      Оплатить
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Cart;
