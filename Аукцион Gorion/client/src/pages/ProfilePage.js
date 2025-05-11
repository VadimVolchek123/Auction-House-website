import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { fetchUserProfile, updateUserProfile } from '../http/userAPI'; // Функции для работы с профилем
import UserProductsWithoutAuction from '../components/UserProductList';
import { observer } from "mobx-react-lite";
import './ProfilePage.css';
import Cart from '../components/Cart';
const ProfilePage = observer(() => {
  const [user, setUser] = useState(null);              // Данные профиля пользователя
  const [loading, setLoading] = useState(true);          // Состояние загрузки
  const [error, setError] = useState(null);              // Состояние ошибки
  const [editMode, setEditMode] = useState(false);       // Режим редактирования

  // Локальное состояние для редактирования профиля, включая замену аватара
  const [editData, setEditData] = useState({
    email: '',
    name: '',
    avatarUrl: '',   // Исходный URL аватара
    avatarFile: null, // выбранный файл для нового аватара
    preview: '',     // Превью нового аватара
  });

  // Определяем базовый URL для формирования полного пути к аватару
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
        setEditData({
          email: userProfile.email || '',
          name: userProfile.name || '',
          avatarUrl: userProfile.avatar || '',
          avatarFile: null,
          preview: userProfile.avatar ? `${baseUrl}/${userProfile.avatar}` : '',
        });
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [baseUrl]);

  // Обработчик изменения текстовых полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик выбора файла для замены аватара
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Генерируем URL для превью выбранного файла
      const preview = URL.createObjectURL(file);
      setEditData(prev => ({
        ...prev,
        avatarFile: file,
        preview: preview,
      }));
    }
  };

  // Обработчик сохранения изменений профиля
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('email', editData.email);
      // Если выбран новый файл для аватара, добавляем файл; иначе передаём старый URL
      if (editData.avatarFile) {
        formData.append('avatar', editData.avatarFile);
      } else {
        formData.append('avatar', editData.avatarUrl);
      }
      console.log (formData);
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser.user);
      setEditMode(false);
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="text-center">
        <div>Загрузка профиля...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center">
        <div>Ошибка: {error}</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center">
        <div>Пользователь не найден</div>
      </Container>
    );
  }

  return (
    <Container className="profile-page">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <div className="profile-avatar mb-3">
                {!editMode ? (
                  // Если не в режиме редактирования, формируем полный URL аватара
                  <Image
                    src={user.avatar ? `${baseUrl}/${user.avatar}` : '/path/to/default-avatar.jpg'}
                    alt="Аватар пользователя"
                    roundedCircle
                    fluid
                  />
                ) : (
                  // В режиме редактирования выводится превью выбранного файла или старый аватар
                  <Image
                    src={editData.preview || '/path/to/default-avatar.jpg'}
                    alt="Новый аватар"
                    roundedCircle
                    fluid
                  />
                )}
              </div>
              {!editMode ? (
                <>
                  <Card.Title>Имя: {user.name || 'Нет данных'}</Card.Title>
                  <Card.Text>Email: {user.email || 'Нет данных'}</Card.Text>
                  <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                    Редактировать профиль
                  </Button>
                </>
              ) : (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Заменить аватар:</Form.Label>
                    <Form.Control type="file" name="avatar" onChange={handleFileChange} />
                  </Form.Group>
                  <Button variant="outline-success" onClick={handleSave}>
                    Сохранить изменения
                  </Button>
                  <Button variant="outline-danger" onClick={() => setEditMode(false)} className="ms-2">
                    Отменить
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <UserProductsWithoutAuction />
      <Cart />
    </Container>
  );
});

export default ProfilePage;
