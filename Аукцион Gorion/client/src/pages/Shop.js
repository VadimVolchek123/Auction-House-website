import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductL from "../components/ProductL";
import Carousel from "../components/Carousels";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchTypes, fetchProducts } from "../http/productAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
    const { product } = useContext(Context);
    (async () => {
        try {
            const products = await fetchProducts(1, 10);
            console.log("Список продуктов:", products.rows);
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
        }
    })();
    if (!product) {
        console.error("Контекст product не определён.");
        return null; // Без product компонент не должен продолжать рендеринг
    }

    useEffect(() => {
        fetchTypes()
            .then(data => product.setTypes(data))
            .catch(err => console.error("Ошибка загрузки типов:", err));
        
        fetchProducts(null, 1, product.limit)
            .then(data => {
                product.setProduct(data.rows);
                product.setTotalCount(data.count);
            })
            .catch(err => console.error("Ошибка загрузки продуктов:", err));
    }, []);

    useEffect(() => {
        fetchProducts(product.selectedType?.id || null, product.page, product.limit)
            .then(data => {
                product.setProduct(data.rows);
                product.setTotalCount(data.count);
            })
            .catch(err => console.error("Ошибка загрузки продуктов:", err));
    }, [product.selectedType, product.page]);

    return (
        <Container>
            <Carousel />
            <Row className="mt-2">
                <Col>
                    <ProductL />
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
