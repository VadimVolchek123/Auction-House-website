import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TypeManagement from '../components/TypeManagement'; // Новый интегрированный менеджер типов
import AdminPanel from '../components/AdminPanel'; // Панель для работы с аукционами и пользователями

const AdminPage = () => {
  return (
    <Container className="mt-5">
      {/* Заголовок страницы */}
      <Row>
        <Col md={12}>
          <h1 className="text-center mb-4">Панель администратора</h1>
        </Col>
      </Row>

      {/* Блок управления типами продуктов (создание и список) */}
      <Row>
        <Col md={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <TypeManagement />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Блок управления аукционами и пользователями */}
      <Row>
        <Col md={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-center">Управление аукционами и пользователями</h3>
              <AdminPanel />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
