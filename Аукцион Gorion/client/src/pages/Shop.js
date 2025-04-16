import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductL from "../components/ProductL";
import Carousel from "../components/Carousels";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchTypes, fetchProductsWithoutAuctionBySeller, fetchProductsWithAuctionBySeller } from "../http/productAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
    const { product } = useContext(Context);

    if (!product) {
        console.error("Контекст product не определён.");
        return <div>Ошибка загрузки данных.</div>;
    }

    const sellerId = 1; // Здесь укажите ID продавца, по которому вы хотите загрузить продукты

    useEffect(() => {
        const loadData = async () => {
            try {
                // Загружаем типы продуктов
                const types = await fetchTypes();
                product.setTypes(types);

                // Загружаем продукты без аукционов для конкретного продавца
                const { productsWithoutAuction } = await fetchProductsWithoutAuctionBySeller(sellerId, 1, product.limit);
                product.setProductsWithoutAuction(productsWithoutAuction);

                // Загружаем продукты с аукционами для конкретного продавца
                const { productsWithAuction } = await fetchProductsWithAuctionBySeller(sellerId, 1, product.limit);
                product.setProductsWithAuction(productsWithAuction);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        loadData();
    }, [sellerId, product.limit]);

    useEffect(() => {
        const loadFilteredProducts = async () => {
            try {
                // Фильтрация продуктов без аукционов
                const { productsWithoutAuction } = await fetchProductsWithoutAuctionBySeller(sellerId, product.page, product.limit);
                product.setProductsWithoutAuction(productsWithoutAuction);

                // Фильтрация продуктов с аукционами
                const { productsWithAuction } = await fetchProductsWithAuctionBySeller(sellerId, product.page, product.limit);
                product.setProductsWithAuction(productsWithAuction);
            } catch (error) {
                console.error("Ошибка загрузки продуктов:", error);
            }
        };

        loadFilteredProducts();
    }, [sellerId, product.page, product.limit]);

    return (
        <Container>
            <Carousel />
            <Row className="mt-3">
                <Col md={12}>
                    <h2 className="text-center">Магазин продуктов</h2>
                </Col>
            </Row>

            {/* Продукты с аукционами */}
            <Row className="mt-3">
                <Col md={12}>
                    <h3>Продукты с аукционами</h3>
                    <ProductL products={product.productsWithAuction} />
                </Col>
            </Row>

            {/* Продукты без аукционов */}
            <Row className="mt-3">
                <Col md={12}>
                    <h3>Продукты без аукционов</h3>
                    <ProductL products={product.productsWithoutAuction} />
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={9}>
                    <Pages />
                </Col>
            </Row>
        </Container>
    );
});

export default Shop;
