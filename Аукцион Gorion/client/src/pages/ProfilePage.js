import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { fetchUserProfile, updateUserProfile } from '../http/userAPI'; // Импорт функций API

const ProfilePage = () => {
    const [user, setUser] = useState(null); // Состояние для данных пользователя
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [editMode, setEditMode] = useState(false); // Режим редактирования

    // Локальное состояние для редактирования данных
    const [editData, setEditData] = useState({
        email: '',
        name: '',
        avatar: ''
    });

    // Получение данных пользователя при монтировании компонента
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setUser(userProfile);
                setEditData({
                    email: userProfile.email || '',
                    name: userProfile.name || '',
                    avatar: userProfile.avatar || ''
                });
            } catch (err) {
                console.error('Ошибка загрузки профиля:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Обработчик изменения данных в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    // Обработчик отправки обновленных данных
    const handleSave = async () => {
        try {
            const updatedUser = await updateUserProfile(editData); // Отправляем запрос на сервер
            setUser(updatedUser.user); // Обновляем данные пользователя
            setEditMode(false); // Выключаем режим редактирования
        } catch (err) {
            console.error('Ошибка обновления профиля:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return <Container className="text-center"><div>Загрузка профиля...</div></Container>;
    }

    if (error) {
        return <Container className="text-center"><div>Ошибка: {error}</div></Container>;
    }

    if (!user) {
        return <Container className="text-center"><div>Пользователь не найден</div></Container>;
    }

    return (
        <Container className="profile-page">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="profile-avatar">
                                <img
                                    src={user.avatar || '/path/to/default-avatar.jpg'} // Используем аватар или изображение по умолчанию
                                    alt="Аватар пользователя"
                                    className="avatar-img"
                                />
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
                                        <Form.Label>Аватар (URL)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="avatar"
                                            value={editData.avatar}
                                            onChange={handleInputChange}
                                        />
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
        </Container>
    );
};

export default ProfilePage;
