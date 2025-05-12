import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "./Product";

const ProductL = ({ products }) => {
  if (!products || !products.length) {
    return <div>Нет продуктов для отображения.</div>;
  }

  return (
    <Row className="g-3">
      {products.map((product, index) => (
        <Col key={`${product.id}-${index}`} xs={12} sm={6} md={3}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductL;
