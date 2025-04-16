import React from "react";
import { Row } from "react-bootstrap";
import Product from "./Product";

const ProductL = ({ products }) => {
    if (!products || !products.length) {
        return <div>Нет продуктов для отображения.</div>;
    }

    return (
        <Row className="d-flex">
            {products.map((product) => (
                <Product key={product.id} product={product} />
            ))}
        </Row>
    );
};

export default ProductL;
