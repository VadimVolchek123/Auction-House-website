import React, { createContext } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import ProductStore from "./store/ProductStore";
import AuctionStore from "./store/ActionStore";

export const Context = createContext(null);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

//console.log(process.env.REACT_APP_API_URL)
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        product: new ProductStore(),
        auction: new AuctionStore(),
    }}>
        <App />
    </Context.Provider>
);