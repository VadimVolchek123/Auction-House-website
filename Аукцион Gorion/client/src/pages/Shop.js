import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import ProductL from "../components/ProductL";
import Carousel from "../components/Carousels";
import Pages from "../components/Pages";
import TypeFilter from "../components/TypeFilter";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchTypes, fetchAllProducts } from "../http/productAPI";

const Shop = observer(() => {
  const { product } = useContext(Context);
  const [loading, setLoading] = useState(false);
  // Сообщение об ошибке от API (например, "Аукционы не найдены.")
  const [errorMsg, setErrorMsg] = useState("");
  
  // Локальное состояние для строки поиска
  // searchInput – текущее значение в поле ввода
  // searchTerm – значение, по которому будет происходить поиск (обновляется при нажатии кнопки/Enter)
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!product) {
    console.error("Контекст product не определён.");
    return <div>Ошибка загрузки данных.</div>;
  }

  // Начальная загрузка типов продуктов (один раз при монтировании)
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await fetchTypes();
        if (types) {
          product.setTypes(types);
        } else {
          console.warn("Типы не были загружены");
        }
      } catch (error) {
        console.error("Ошибка загрузки типов:", error);
      }
    };
    loadTypes();
  }, [product]);

  // Загрузка продуктов при изменении страницы, лимита, поискового запроса или выбранного типа
  useEffect(() => {
    const loadFilteredProducts = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // Если выбран тип, передаем его id, иначе пустую строку (или null)
        const typeId = product.selectedType ? product.selectedType.id : "";
        const { products: prods, count, message } = await fetchAllProducts(
          product.page,
          product.limit,
          searchTerm,
          typeId
        );
        if (message) {
          setErrorMsg(message);
          product.setProducts([]);
          product.setTotalCount(0);
        } else {
          product.setProducts(prods);
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
  }, [product.page, product.limit, searchTerm, product.selectedType, product]);

  // Функция для запуска поиска, вызывается кнопкой или при нажатии Enter
  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  return (
    <Container>
      <Carousel />
      
      {/* Поле поиска */}
      <Row className="mt-3">
        <Col md={12}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Поиск по имени товара..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              // Если нажимаем Enter, запускаем поиск
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button variant="primary" onClick={handleSearch}>
              Найти
            </Button>
          </InputGroup>
        </Col>
      </Row>
      
      {/* Фильтр по типам */}
      <Row className="mt-3">
        <Col md={12}>
          <TypeFilter />
        </Col>
      </Row>
      
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

      {/* Вывод ошибки, если она есть */}
      {!loading && errorMsg && (
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>{errorMsg}</p>
          </Col>
        </Row>
      )}

      {/* Если нет ошибок и загрузка завершена — выводим товары */}
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
