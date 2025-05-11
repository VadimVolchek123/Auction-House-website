import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductInfo from '../components/ProductInfo'; // Импорт компонента для вывода информации о продукте
import { fetchOneProduct } from '../http/productAPI'; // Функция для получения одного продукта

const ProductPage = () => {
  const { id } = useParams(); // Получаем id продукта из URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // При загрузке компонента делаем запрос к API для получения продукта по id
  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log (id);
        const data = await fetchOneProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Ошибка при загрузке продукта:', err);
        setError('Не удалось загрузить продукт');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error || !product) {
    return <div>{error || 'Продукт не найден.'}</div>;
  }

  return (
    <div>
      <ProductInfo product={product} />
    </div>
  );
};

export default ProductPage;
