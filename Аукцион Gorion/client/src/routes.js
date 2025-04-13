import Admin from "./pages/Admin";
import { 
    ADMIN_ROUTE, 
    PRODUCT_ROUTE, 
    LOGIN_ROUTE, 
    REGISTRATION_ROUTE, 
    SHOP_ROUTE, 
    AUCTION_ROUTE, 
    USER_PROFILE_ROUTE, 
    SELLER_PRODUCTS_ROUTE 
} from "./utils/const";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Profile from "./pages/ProfilePage";
import AuctionPage from './pages/AuctionPage';
import ProductPage from "./pages/ProductPage";
import SellerProducts from "./pages/SellerProductsPage";

export const authRoutes = [
    {
        path: USER_PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: SELLER_PRODUCTS_ROUTE,
        Component: SellerProducts // Страница со списком продуктов продавца
    }
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PRODUCT_ROUTE + '/:id',
        Component: ProductPage
    },
    {
        path: AUCTION_ROUTE + '/:id',
        Component: AuctionPage // Теперь включена поддержка конкретного аукциона по ID
    }
];
