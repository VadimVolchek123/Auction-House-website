import React, { useEffect, useState } from 'react';
import { fetchTypes } from '../http/productAPI';
import { Table, Container, Alert } from 'react-bootstrap';

const TypeList = () => {
  const [types, setTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getTypes = async () => {
      try {
        const fetchedTypes = await fetchTypes();
        setTypes(fetchedTypes);
      } catch (error) {
        setErrorMessage('Ошибка при загрузке типов продуктов.');
      }
    };
    getTypes();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Список типов продуктов</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
    </Container>
  );
};

export default TypeList;
