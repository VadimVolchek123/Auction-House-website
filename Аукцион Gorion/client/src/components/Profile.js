import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Context } from '../index'; // Контекст приложения
//import './ProfilePage.css'; // Ваши стили

const ProfilePage = () => {
  const { user } = useContext(Context); // Получаем данные пользователя из контекста
  if (!user) {
    console.error('Контекст user не определён.');
    return null; // Без user компонент не должен продолжать рендеринг
}
  console.log(user);
  return (
    <Container className="profile-page">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <div className="profile-avatar">
                <img
                  src={user.avatar || '/path/to/default-avatar.jpg'} // Аватар по умолчанию
                  alt="Аватар пользователя"
                  className="avatar-img"
                />
              </div>
              <Card.Title>Имя: {user.name || 'Нет данных'}</Card.Title>
              <Card.Text>Email: {user.email || 'Нет данных'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
