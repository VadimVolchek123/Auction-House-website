import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Profile from "./pages/ProfilePage";
import AuctionPage from './pages/AuctionPage';
import ProductPage from "./pages/ProductPage";
import SellerProducts from "./pages/SellerProductsPage";
import CreateProducts from "./pages/CreateProductPage";
import { 
    ADMIN_ROUTE, 
    PRODUCT_ROUTE, 
    LOGIN_ROUTE, 
    REGISTRATION_ROUTE, 
    SHOP_ROUTE, 
    AUCTION_ROUTE, 
    USER_PROFILE_ROUTE, 
    SELLER_PRODUCTS_ROUTE,
    CREATEPRODUCT_ROUTE
} from "./utils/const";

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
    },
    {
        path: CREATEPRODUCT_ROUTE,
        Component: CreateProducts
    },
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
        path: AUCTION_ROUTE + '/:auctionId',
        Component: AuctionPage
    }
];
