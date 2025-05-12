// TypeList.jsx
import React, { useEffect, useState } from 'react';
import { fetchTypes } from '../http/productAPI';
import { Table, Container, Alert, Spinner } from 'react-bootstrap';
import { observer } from "mobx-react-lite";

const TypeList = observer(({ refresh }) => {
  const [types, setTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTypes = async () => {
      try {
        const fetchedTypes = await fetchTypes();
        setTypes(fetchedTypes);
      } catch (error) {
        console.error("Ошибка при загрузке типов продуктов:", error);
        setErrorMessage('Ошибка при загрузке типов продуктов.');
      } finally {
        setLoading(false);
      }
    };
    getTypes();
  }, [refresh]); // Обновление эффекта при изменении refresh

  return (
    <Container className="mt-5">
      <h2>Список типов продуктов</h2>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      )}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {!loading && types.length === 0 && !errorMessage && (
        <Alert variant="info">Типы продуктов не найдены.</Alert>
      )}
      {types.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Название типа</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type, index) => (
              <tr key={type.id}>
                <td>{index + 1}</td>
                <td>{type.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
});

export default TypeList;
