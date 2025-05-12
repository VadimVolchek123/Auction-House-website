// CreateType.jsx
import React, { useState } from 'react';
import { createType } from '../http/productAPI';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const CreateType = ({ onTypeCreated }) => {
  const [typeName, setTypeName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newType = await createType({ name: typeName });
      setSuccessMessage(`Тип "${newType.name}" успешно создан!`);
      setErrorMessage('');
      setTypeName(''); // сброс поля ввода
      if (onTypeCreated) {
        onTypeCreated(); // сигнал о создании нового типа для обновления таблицы
      }
    } catch (error) {
      setErrorMessage('Ошибка при создании типа.');
      setSuccessMessage('');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Создание нового типа продукта</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Название типа:</Form.Label>
          <Form.Control
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="Введите название типа"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Создать тип
        </Button>
      </Form>
    </Container>
  );
};

export default CreateType;
