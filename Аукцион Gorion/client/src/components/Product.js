import React from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { PRODUCT_ROUTE } from "../utils/const";
import "./Product.css";

const Product = ({ product }) => {
    const navigate = useNavigate();

    // Базовый URL для API
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Условно проверяем наличие изображения
    const productImage = product.img ? `${baseUrl}/${product.img}` : "fallback-image.jpg";

    // Убедитесь, что поля аукциона соответствуют новой модели
    return (
        <Col md={3} className="mt-3" onClick={() => navigate(`${PRODUCT_ROUTE}/${product.id}`)}>
            <Card className="card-product">
                {/* Отображение изображения продукта */}
                <Image src={productImage} alt={product.name || "Product Image"} className="product-image" />

                {/* Название продукта */}
                <div className="card-title">
                    {product.name || "Без названия"}
                </div>

                {/* Информация о продукте и аукционе */}
                <div className="auction-details">
                    <p><strong>Продавец:</strong> {product.seller?.name || "Не указан"}</p>
                    <p><strong>Описание:</strong> {product.description || "Описание отсутствует"}</p>
                    <p><strong>Начало аукциона:</strong> {product.auction?.startTime || "Не указано"}</p>
                    <p><strong>Конец аукциона:</strong> {product.auction?.endTime || "Не указано"}</p>
                    <p><strong>Начальная цена:</strong> {product.auction?.startingPrice || "Не указано"} $</p>
                </div>
            </Card>
        </Col>
    );
};

export default Product;
