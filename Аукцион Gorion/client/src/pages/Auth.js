import React, { useContext, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/const";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    // Состояние для ввода данных
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Обработчик нажатия кнопки
    const handleClick = async () => {
        try {
            let data;

            if (isLogin) {
                // Логика авторизации
                data = await login(email, password);
            } else {
                // Логика регистрации
                data = await registration(email, password, name);
            }

            user.setUser(data); // Сохраняем данные пользователя в хранилище
            user.setIsAuth(true); // Устанавливаем флаг авторизации
            navigate(SHOP_ROUTE); // Перенаправляем на главную страницу
        } catch (error) {
            alert(error.response?.data?.message || "Произошла ошибка."); // Вывод ошибки
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    {/* Поле ввода email */}
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    {/* Поле ввода пароля */}
                    <Form.Control
                        className="mt-3"
                        type="password"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {/* Поле ввода имени (отображается только при регистрации) */}
                    {!isLogin && (
                        <Form.Control
                            className="mt-3"
                            placeholder="Введите ваше имя..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    )}

                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ? (
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
                            </div>
                        ) : (
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        )}
                        <Button
                            variant={"outline-success"}
                            onClick={handleClick}
                        >
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
