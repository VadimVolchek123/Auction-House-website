import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductL from "../components/ProductL";
import Carousel from "../components/Carousels";
import Pages from "../components/Pages";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchTypes, fetchAllProducts } from "../http/productAPI";

const Shop = observer(() => {
  const { product } = useContext(Context);
  const [loading, setLoading] = useState(false);

  if (!product) {
    console.error("Контекст product не определён.");
    return <div>Ошибка загрузки данных.</div>;
  }

  // Начальная загрузка типов и первой страницы продуктов
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Загружаем типы продуктов
        const types = await fetchTypes();
        product.setTypes(types);

        // Загружаем все продукты (первая страница)
        const { products, count } = await fetchAllProducts(1, product.limit);
        product.setProducts(products);
        product.setTotalCount(count);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [product.limit]);

  // Загрузка продуктов при изменении номера страницы или лимита
  useEffect(() => {
    const loadFilteredProducts = async () => {
      setLoading(true);
      try {
        const { products, count } = await fetchAllProducts(product.page, product.limit);
        product.setProducts(products);
        product.setTotalCount(count);
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
      } finally {
        setLoading(false);
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

      {loading && (
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>Загрузка...</p>
          </Col>
        </Row>
      )}

      {!loading && (
        <Row className="mt-3">
          <Col md={12}>
            <h3>Все товары</h3>
            <ProductL products={product.products} />
          </Col>
        </Row>
      )}

      <Row className="mt-3">
        <Col md={9}>
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
