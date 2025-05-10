// AppRouter.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { user } = useContext(Context); 
  console.log("Авторизация:", user.isAuth);

  return (
    <Routes>
      {/* Защищённые маршруты – доступны только авторизованным пользователям */}
      {user.isAuth && authRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />  
      ))}
      {/* Публичные маршруты */}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {/* Обработка неизвестных маршрутов */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
});

export default AppRouter;
