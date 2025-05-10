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
  // Если API возвращает сообщение (например, "Аукционы не найдены.")
  const [errorMsg, setErrorMsg] = useState("");

  if (!product) {
    console.error("Контекст product не определён.");
    return <div>Ошибка загрузки данных.</div>;
  }

  // Начальная загрузка типов и первой страницы продуктов
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // Загружаем типы продуктов
        const types = await fetchTypes();
        if (types) {
          product.setTypes(types);
        } else {
          console.warn("Типы не были загружены");
        }

        // Загружаем все продукты (первая страница)
        // Предполагается, что API возвращает объект { products, count } или объект с полем message при отсутствии данных
        const { products, count, message } = await fetchAllProducts(1, product.limit);
        if (message) {
          // Если API вернуло сообщение, сохраняем его в состоянии errorMsg
          setErrorMsg(message);
          product.setProducts([]);
          product.setTotalCount(0);
        } else {
          product.setProducts(products);
          product.setTotalCount(count);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setErrorMsg("Ошибка загрузки данных.");
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
      setErrorMsg("");
      try {
        const { products, count, message } = await fetchAllProducts(product.page, product.limit);
        if (message) {
          setErrorMsg(message);
          product.setProducts([]);
          product.setTotalCount(0);
        } else {
          product.setProducts(products);
          product.setTotalCount(count);
        }
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
        setErrorMsg("Ошибка загрузки продуктов.");
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

      {/* Если не загружается, но есть сообщение от API */}
      {!loading && errorMsg && (
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>{errorMsg}</p>
          </Col>
        </Row>
      )}

      {/* Если не загружается и нет сообщения — выводим товары */}
      {!loading && !errorMsg && (
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
