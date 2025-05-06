// ProductForm.jsx
import React, { useState } from 'react';
import { createProduct } from '../http/productAPI';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const ProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    status: 'AVAILABLE',
    sellerId: '',
    typeId: '',
    info: '',
    img: null,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductData(prev => ({ ...prev, img: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('status', productData.status);
    formData.append('sellerId', productData.sellerId);
    formData.append('typeId', productData.typeId);
    formData.append('info', productData.info);
    formData.append('img', productData.img);

    try {
      const newProduct = await createProduct(formData);
      setSuccessMessage(`Продукт "${newProduct.name}" успешно создан!`);
    } catch (error) {
      console.error('Ошибка создания продукта:', error.message);
      setErrorMessage('Ошибка создания продукта. Попробуйте ещё раз.');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h1 className="text-center mb-4">Создание нового продукта</h1>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Название:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
                placeholder="Введите название продукта"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание:</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={productData.description}
                onChange={handleChange}
                required
                placeholder="Введите описание продукта"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID продавца:</Form.Label>
              <Form.Control
                type="text"
                name="sellerId"
                value={productData.sellerId}
                onChange={handleChange}
                required
                placeholder="Введите ID продавца"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID типа продукта:</Form.Label>
              <Form.Control
                type="text"
                name="typeId"
                value={productData.typeId}
                onChange={handleChange}
                required
                placeholder="Введите ID типа продукта"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Дополнительная информация (JSON):</Form.Label>
              <Form.Control
                as="textarea"
                name="info"
                value={productData.info}
                onChange={handleChange}
                placeholder="Введите JSON с дополнительной информацией"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Изображение:</Form.Label>
              <Form.Control
                type="file"
                name="img"
                onChange={handleFileChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Создать продукт
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
