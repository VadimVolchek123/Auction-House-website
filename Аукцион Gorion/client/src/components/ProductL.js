import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import Product from "./Product";

const ProductL = observer(() => {
    const { product } = useContext(Context);

    if (!product || !Array.isArray(product.product)) {
        return <div>Загрузка...</div>;
    }

    return (
        <Row className="d-flex">
            {product.product.map((item) => (
                <Product key={item.id} product={item} />
            ))}
        </Row>
    );
});

export default ProductL;
