import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductL from "../components/ProductL";
import Carousel from "../components/Carousels";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchTypes, fetchAllProducts } from "../http/productAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
  const { product } = useContext(Context);

  if (!product) {
    console.error("Контекст product не определён.");
    return <div>Ошибка загрузки данных.</div>;
  }

  // Начальная загрузка типов и первых товаров
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем типы продуктов
        const types = await fetchTypes();
        product.setTypes(types);

        // Загружаем все товары (первую страницу)
        const { products, count } = await fetchAllProducts(1, product.limit);
        product.setProducts(products);
        product.setCount(count);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadData();
  }, [product.limit]);

  // Загрузка товаров при изменении номера страницы или лимита
  useEffect(() => {
    const loadFilteredProducts = async () => {
      try {
        const { products, count } = await fetchAllProducts(product.page, product.limit);
        product.setProducts(products);
        product.setCount(count);
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
      }
    };

    loadFilteredProducts();
  }, [product.page, product.limit]);

  return (
    <Container>
      <Carousel />
      <Row className="mt-3">
        <Col md={12}>
          <h2 className="text-center">Магазин продуктов</h2>
        </Col>
      </Row>

      {/* Вывод всех товаров */}
      <Row className="mt-3">
        <Col md={12}>
          <h3>Все товары</h3>
          <ProductL products={product.products} />
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
