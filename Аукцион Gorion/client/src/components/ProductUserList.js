import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductUserList = ({ products }) => {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  return (
    <>
      {products.map((product) => {
        // Используем предоставленный код для построения пути к изображению
        const productImage = product.img 
          ? `${baseUrl}/${product.img}` 
          : "fallback-image.jpg"; // fallback-изображение должно лежать в public

        return (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card style={{ width: "18rem", marginRight: "1rem" }}>
              <Card.Img variant="top" src={productImage} alt={product.name} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        );
      })}
    </>
  );
};

export default ProductUserList;
