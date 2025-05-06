// CreatePage.jsx
import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import ProductForm from '../components/ProductForm';
import AuctionForm from '../components/AuctionForm';

const CreatePage = () => {
  const [activeKey, setActiveKey] = useState('product');

  return (
    <Container className="mt-5">
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        id="create-tabs"
        className="mb-3"
      >
        <Tab eventKey="product" title="Создать продукт">
          <ProductForm />
        </Tab>
        <Tab eventKey="auction" title="Создать аукцион">
          <AuctionForm />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CreatePage;
