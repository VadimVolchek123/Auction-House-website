import React, {useContext} from 'react';
import {authRoutes, publicRoutes} from "../routes";
import {Routes, Route, Navigate} from 'react-router-dom';
import {Context} from "../index"
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
  const {user} = useContext(Context); 
  console.log(user)
  console.log(user.isAuth)
  return (
      <Routes>
          {user.isAuth && authRoutes.map(({path, Component}) => (
              <Route key={path} path={path} element={<Component />} />  
          ))}
          {publicRoutes.map(({path, Component}) => (
              <Route key={path} path={path} element={<Component />} />
          ))}
          {/* Обработка неизвестных маршрутов */}
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
});

export default AppRouter;
