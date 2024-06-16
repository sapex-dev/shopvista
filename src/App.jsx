import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import ForgotPass from "./pages/ForgotPass";
import ResetPass from "./pages/ResetPass";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import ProductDetail from "./pages/ProductDetail";
import WishList from "./components/WishList";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import FAQsUI from "./pages/FAQ";
import PageNotFound from "./pages/PageNotFound";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import AddMoneyForm from "./pages/Checkout";
import WalletTransactionHistory from "./pages/WalletTransactionHistory ";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
          <Route element={<Layout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/confirm" element={<ConfirmEmail />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/reset-password" element={<ResetPass />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<AddMoneyForm />} />
            <Route path="/order" element={<Order />} />
            <Route path="/faq" element={<FAQsUI />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/transaction" element={<WalletTransactionHistory />} />
          </Route>
        </Routes>
        <Toaster position="top-center" autoClose="3000" />
      </BrowserRouter>
    </>
  );
}

export default App;
