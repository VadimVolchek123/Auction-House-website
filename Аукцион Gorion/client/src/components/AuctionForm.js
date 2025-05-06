import React, { useState } from 'react';
import { createAuction } from '../http/auctionAPI';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const AuctionForm = () => {
  const [auctionData, setAuctionData] = useState({
    productId: '',
    startingPrice: '',
    reservePrice: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const newAuction = await createAuction(auctionData);
      setSuccessMessage(`Аукцион для продукта, успешно создан!`);
    } catch (error) {
      console.error('Ошибка создания аукциона:', error.message);
      setErrorMessage('Ошибка создания аукциона. Попробуйте ещё раз.');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h1 className="text-center mb-4">Создание аукциона</h1>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID продукта:</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={auctionData.productId}
                onChange={handleChange}
                required
                placeholder="Введите ID продукта для аукциона"
              />
              </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание к аукциону:</Form.Label>
              <Form.Control
                type="textarea"
                name="description"
                value={auctionData.description}
                onChange={handleChange}
                required
                placeholder="Введите описание аукциона"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Стартовая цена:</Form.Label>
              <Form.Control
                type="number"
                name="startingPrice"
                value={auctionData.startingPrice}
                onChange={handleChange}
                required
                placeholder="Введите стартовую цену"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Резервная цена:</Form.Label>
              <Form.Control
                type="number"
                name="reservePrice"
                value={auctionData.reservePrice}
                onChange={handleChange}
                placeholder="Введите резервную цену (опционально)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Время начала:</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startTime"
                value={auctionData.startTime}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Время окончания:</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endTime"
                value={auctionData.endTime}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Создать аукцион
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionForm;
