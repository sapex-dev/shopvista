import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./Footer/Footer";
import AddMoneyHeader from "../components/AddMoneyHeader/AddMoneyHeader.jsx";

const Layout = () => {
  const navigate = useNavigate();
  const isLoggedIn =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div>
      <AddMoneyHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
