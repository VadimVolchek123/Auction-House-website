import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import CreateType from '../components/CreateType'; // Компонент создания типа
import TypeList from '../components/AllType'; // Компонент просмотра всех типов
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

      {/* Блок управления типами продуктов */}
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Создание нового типа продукта</h3>
              <CreateType />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Список типов продуктов</h3>
              <TypeList />
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
