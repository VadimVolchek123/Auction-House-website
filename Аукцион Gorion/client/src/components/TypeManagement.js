// TypeManagement.jsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import CreateType from './CreateType';
import TypeList from './AllType';

const TypeManagement = () => {
  // Счетчик обновлений, изменяющийся после добавления нового типа
  const [refresh, setRefresh] = useState(0);

  // Вызывается после успешного создания типа
  const handleTypeCreated = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <Container>
      <CreateType onTypeCreated={handleTypeCreated} />
      <TypeList refresh={refresh} />
    </Container>
  );
};

export default TypeManagement;
