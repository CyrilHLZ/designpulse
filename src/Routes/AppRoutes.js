import {Routes, Route, BrowserRouter} from "react-router-dom";
import HomePage from "../Pages/HomePage";
import ShopPage from "../Pages/Shop/ShopPage";
import LoginPage from "../Pages/Users/LoginPage";
import RegisterPage from "../Pages/Users/EnregisterPage";
import AdminPanelPage from "../Pages/AdminPanel/AdminPanelPage";
import CreateProductPage from "../Pages/Shop/CreateProductPage";
import UpdateProductPage from "../Pages/Shop/UpdateProductPage";
import DetailsProductPage from "../Pages/Shop/DetailsProductPage";
import BuyProductPage from "../Pages/Shop/BuyProductPage";
import OrderProductPage from "../Pages/Shop/OrderProductPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/adminPanel" element={<AdminPanelPage />} />

                <Route path="/shop" element={<ShopPage />} />
                <Route path="/createProduct" element={<CreateProductPage />} />
                <Route path="/updateProduct/:productId" element={<UpdateProductPage />} />
                <Route path="/BuyProductPage/:productId/" element={<BuyProductPage />} />
                <Route path="/DetailsProductPage/:productId" element={<DetailsProductPage />} />
                <Route path="OrderProductPage" element={<OrderProductPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;