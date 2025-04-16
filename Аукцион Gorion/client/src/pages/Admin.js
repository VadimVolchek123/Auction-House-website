import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CreateType from '../components/CreateType'; // Компонент создания типа
import TypeList from '../components/AllType'; // Компонент просмотра всех типов

const AdminPage = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <h1 className="text-center mb-4">Панель администратора</h1>
        </Col>
      </Row>
      <Row>
        {/* Блок создания типа */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Создание нового типа продукта</h3>
              <CreateType />
            </Card.Body>
          </Card>
        </Col>
        {/* Блок списка типов */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h3>Список типов продуктов</h3>
              <TypeList />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
