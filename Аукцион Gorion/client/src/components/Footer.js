import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer id="contacts" className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0">
              © {new Date().getFullYear()} Gorion compani. Все права защищены.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <a
              href="tel:+375333925599"
              className="text-white me-3"
              style={{ textDecoration: 'none' }}
            >
              +375333925599
            </a>
            <a
              href="mailto:gogippogip@mail.ru"
              className="text-white"
              style={{ textDecoration: 'none' }}
            >
              gogippogip@mail.ru
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
