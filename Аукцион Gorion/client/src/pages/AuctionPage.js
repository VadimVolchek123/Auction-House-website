import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchAuctionById, placeBid, updateHighestBid, getMaxPrice } from "../http/auctionAPI";
import { Context } from "../index"; // Подключаем контекст для получения userId

const AuctionPage = () => {
  // Извлекаем auctionId из URL
  const { auctionId } = useParams();
  console.log("Extracted auctionId:", auctionId);

  // Получаем userId из контекста
  const { user } = useContext(Context);
  const userId = user?.id;
  console.log("User ID:", userId);

  // Состояния для данных аукциона и ставок
  const [auction, setAuction] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [error, setError] = useState("");

  // Функция загрузки аукциона и обновления текущей ставки через getMaxPrice
  const loadAuctionData = async () => {
    try {
      const data = await fetchAuctionById(auctionId);
      setAuction(data);
      // Используем новую функцию getMaxPrice для получения актуальной самой высокой ставки
      const maxData = await getMaxPrice(auctionId);
      // Ожидается, что maxData возвращает объект вида { maxPrice: <число> }
      setCurrentBid(maxData.maxPrice);
    } catch (err) {
      console.error("Ошибка загрузки аукциона:", err);
      setError("Ошибка загрузки аукциона.");
    } finally {
      setLoading(false);
    }
  };

  // Начальная загрузка аукциона при монтировании компонента
  useEffect(() => {
    if (!auctionId) {
      setError("Ошибка: ID аукциона не передан.");
      setLoading(false);
      return;
    }
    loadAuctionData();
  }, [auctionId]);

  // Обработчик размещения ставки
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    if (!userId) {
      setBidError("Ошибка: Вы должны быть авторизованы для размещения ставки.");
      return;
    }

    const newBid = parseFloat(bidAmount);
    if (isNaN(newBid) || newBid <= currentBid) {
      setBidError(`Ставка должна быть больше текущей (${currentBid} руб.)`);
      return;
    }

    setPlacingBid(true);
    try {
      await placeBid(auctionId, newBid, userId);
      // Обновляем максимальную ставку на сервере
      await updateHighestBid(auctionId);
      // Получаем актуальные данные через getMaxPrice
      const maxData = await getMaxPrice(auctionId);
      setCurrentBid(maxData.maxPrice);
      setBidSuccess("Ставка принята!");
    } catch (err) {
      console.error("Ошибка при размещении ставки:", err);
      setBidError("Ошибка при размещении ставки.");
    } finally {
      setPlacingBid(false);
      setBidAmount("");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <div>Загрузка аукциона...</div>
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
    <Container className="py-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="text-center">
              <h2>{auction.productName}</h2>
              <p>
                Текущая ставка: <strong>{currentBid} руб.</strong>
              </p>
            </Card.Header>
            <Card.Body>
              {auction.image && (
                <div className="text-center mb-4">
                  <img
                    src={auction.image}
                    alt={auction.productName}
                    className="img-fluid"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )}
              {auction.description && <p>{auction.description}</p>}
              <hr />
              <Form onSubmit={handlePlaceBid}>
                <Form.Group controlId="bidAmount">
                  <Form.Label>Ваша ставка (руб.)</Form.Label>
                  <Form.Control
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Введите сумму больше ${currentBid}`}
                    required
                  />
                </Form.Group>
                {bidError && <Alert variant="danger" className="mt-3">{bidError}</Alert>}
                {bidSuccess && <Alert variant="success" className="mt-3">{bidSuccess}</Alert>}
                <Button variant="primary" type="submit" className="mt-3" disabled={placingBid}>
                  {placingBid ? "Размещение ставки..." : "Сделать ставку"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionPage;
