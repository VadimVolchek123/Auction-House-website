import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Context } from '../index'; // Контекст
import { ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, USER_PROFILE_ROUTE, CREATEPRODUCT_ROUTE } from '../utils/const'; // Маршруты
import './Navbar.css'; // Стили

const MergedNavbar = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // Управление панелью пользователя

  const logOut = () => {
    user.setIsAuth(false); // Устанавливаем авторизацию в false
    navigate(SHOP_ROUTE); // Перенаправление на главную
  };

  // Обработчик для плавного скролла к футеру (элемент с id="contacts")
  const scrollToFooter = (e) => {
    e.preventDefault(); // Отменяем стандартное поведение ссылки
    const footerElement = document.getElementById('contacts');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Navbar expand="lg" fixed="top" className="fw-semibold">
      <Container fluid>
        <Navbar.Brand href="#" className="text-light fw-bold">
          Gorion
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* Левое меню */}
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '80px' }}
            navbarScroll
          >
            <Nav.Link onClick={() => navigate(SHOP_ROUTE)} className="text-light fw-semibold">
              Аукционы
            </Nav.Link>
            <Nav.Link href="#contacts" onClick={scrollToFooter} className="text-light fw-semibold">
              Информация
            </Nav.Link>
          </Nav>
          {/* Правое меню */}
          <Nav className="ml-auto">
            {/* Иконка пользователя */}
            <Dropdown
              show={showDropdown}
              onToggle={() => setShowDropdown(!showDropdown)}
              align="end"
            >
              <Dropdown.Toggle variant="outline-light" className="user-icon">
                <img
                  src="/path/to/user-icon.svg" // Путь к иконке пользователя
                  alt="User Icon"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user.isAuth ? (
                  <>
                    <Dropdown.Item onClick={() => navigate(USER_PROFILE_ROUTE)}>
                      Профиль пользователя
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(ADMIN_ROUTE)}>
                      Панель администратора
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(CREATEPRODUCT_ROUTE)}>
                      Создать товар
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logOut}>
                      Выход
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => navigate(REGISTRATION_ROUTE)}>
                      Регистрация
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(LOGIN_ROUTE)}>
                      Вход
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MergedNavbar;
