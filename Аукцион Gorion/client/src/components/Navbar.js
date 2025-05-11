import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { Context } from '../index';
import { 
  ADMIN_ROUTE, 
  LOGIN_ROUTE, 
  REGISTRATION_ROUTE, 
  SHOP_ROUTE, 
  USER_PROFILE_ROUTE, 
  CREATEPRODUCT_ROUTE 
} from '../utils/const';
import TopUpModal from './TopUpModal';
import './Navbar.css';

const MergedNavbar = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const logOut = () => {
    user.setIsAuth(false);
    navigate(SHOP_ROUTE);
  };

  // Обработчик для плавного скролла
  const scrollToFooter = (e) => {
    e.preventDefault();
    const footerElement = document.getElementById('contacts');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="fw-semibold">
        <Container fluid>
          <Navbar.Brand href="#" className="text-light fw-bold">
            Gorion
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
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
            <Nav className="ml-auto d-flex align-items-center">
              {user.isAuth && (
                <div className="text-light me-3 d-flex align-items-center">
                  <span>
                    {Number(user.balance || 0).toFixed(2)} руб
                  </span>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => setShowTopUp(true)}
                  >
                    Пополнить
                  </Button>
                </div>
              )}
              <Dropdown
                show={showDropdown}
                onToggle={() => setShowDropdown(!showDropdown)}
                align="end"
              >
                <Dropdown.Toggle variant="outline-light" className="user-icon">
                  <img
                    src="/path/to/user-icon.svg"
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
                      {user.role && user.role.toUpperCase() === 'ADMIN' && (
                        <Dropdown.Item onClick={() => navigate(ADMIN_ROUTE)}>
                          Панель администратора
                        </Dropdown.Item>
                      )}
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

      {user.isAuth && (
        <TopUpModal 
          show={showTopUp} 
          handleClose={() => setShowTopUp(false)}
          userStore={user}
        />
      )}
    </>
  );
};

export default observer(MergedNavbar);
