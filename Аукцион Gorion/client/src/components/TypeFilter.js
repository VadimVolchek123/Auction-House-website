import React, { useContext } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const TypeFilter = observer(() => {
  const { product } = useContext(Context);
  const { types, selectedType } = product;

  const handleSelectType = (type) => {
    // Если выбранный тип уже выбран, сбрасываем фильтр (All)
    if (selectedType && selectedType.id === type.id) {
      product.setSelectedType(null);
    } else {
      product.setSelectedType(type);
    }
    // Сбрасываем страницу на первую, чтобы правильно отобразить фильтрованные результаты
    product.setPage(1);
  };

  return (
    <div className="mb-3">
      <ButtonGroup>
        <Button
          variant={!selectedType ? "primary" : "outline-primary"}
          onClick={() => product.setSelectedType(null)}
        >
          Все типы
        </Button>
        {types && types.length > 0 && types.map((type) => (
          <Button
            key={type.id}
            variant={
              selectedType && selectedType.id === type.id
                ? "primary"
                : "outline-primary"
            }
            onClick={() => handleSelectType(type)}
          >
            {type.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
});

export default TypeFilter;
