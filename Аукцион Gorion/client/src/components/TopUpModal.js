import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { topUpAccount } from "../http/userAPI"; // Функция для пополнения баланса
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

const TopUpModal = observer(({ show, handleClose, userStore }) => {
  // Локальные состояния для суммы и "пустышек" для вида
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Введите корректную сумму пополнения");
      return;
    }
    setError("");
    try {
      // Вызываем API для пополнения баланса, передаем только сумму
      const data = await topUpAccount(value);
      // Сообщаем, что пополнение успешно выполнено и очищаем форму
      setMessage(`Баланс успешно пополнен на ${value} руб.`);
      setAmount("");
      setCardNumber("");
      setCardExpiry("");
      // Обновляем баланс в MobX‑хранилище в рамках действия (action)
      runInAction(() => {
        if (data.balance !== undefined) {
          // Если в UserStore реализован метод setBalance, используем его
          if (typeof userStore.setBalance === "function") {
            userStore.setBalance(data.balance);
          } else if (typeof userStore.setUser === "function") {
            // Если нет, обновляем через setUser, сохраняя остальные данные
            userStore.setUser({ ...userStore.user, balance: data.balance });
          }
        }
      });
    } catch (err) {
      console.error("Ошибка пополнения:", err);
      setError("Ошибка при пополнении баланса.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Пополнение баланса</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="topupAmount">
            <Form.Label>Сумма пополнения</Form.Label>
            <Form.Control
              type="number"
              placeholder="Введите сумму"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          {/* Поля для вида – номер карты и срок годности */}
          <Form.Group controlId="cardNumber" className="mt-3">
            <Form.Label>Номер карты</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите номер карты"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="cardExpiry" className="mt-3">
            <Form.Label>Срок годности карты (MM/YY)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите срок годности"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Пополнить
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
});

export default TopUpModal;
