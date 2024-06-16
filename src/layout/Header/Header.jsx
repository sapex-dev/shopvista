import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { setLogout } from "../../redux/authSlice";
// import { useMutation } from "@tanstack/react-query";
// import { deleteUserAccount } from "../../services/apiQR";
// import Cookies from "js-cookie";
import { FaCartShopping } from "react-icons/fa6";
// import Cart from "../../../components/User/Cart";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { setLogout, setWallet } from "../../redux/authSlice";
import Cart from "../../components/Cart";
import { useQuery } from "@tanstack/react-query";
import { IoMdWallet } from "react-icons/io";
import { getWallet } from "../../services/Wallet/walletAPI";
import AddWalletModal from "../../components/addWalletModal";
import {
  CardElement,
  useStripe,
  Elements,
  useElements,
} from "@stripe/react-stripe-js";

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const location = useLocation();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const email = useSelector((state) => state.auth.email);
  const name = useSelector((state) => state.auth.name);
  // const token = useSelector((state) => state.auth.token);
  const numOfCartItems = useSelector((state) => state.cart.numOfCartItems);
  const amount = useSelector((state) => state.auth.wallet);
  const numOfWhishlistItems = useSelector(
    (state) => state.wishlist.numOfWishlistItems
  );
  const [isWalletOpen, setWalletOpen] = useState(false); // State variable for wallet dropdown visibility
  const [addAmount, setAddAmount] = useState(0);
  // const publishableKey =
  //   "pk_test_51LzxA5SHOUlzFrbDsa8XwGpBwoHgKqkyQ8nMfnchut72i1XxyuhKivj9HKbQD3rodrEl80ss2WtXbWFc8E2sFINO00XWTlL38s";
  // const [stripepromise, setstripepromise] = useState(false);

  // useState(() => {
  //   const stripePromise = loadStripe(publishableKey);
  //   setstripepromise(stripePromise);
  // }, []);

  const stripe = useStripe();
  const elements = useElements();

  const handleCartClick = () => {
    setCartOpen(!isCartOpen);
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(setLogout());
    localStorage.clear();
    navigate("/login");
  };

  const handleProfileOpen = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Function to toggle wallet dropdown visibility
  const handleWalletClick = () => {
    setWalletOpen(!isWalletOpen);
  };

  const OpenModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // <-------- Get All Wishlist Products ---------------->
  const { isSuccess, data } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => getWallet(token),
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    dispatch(setWallet(data.data?.data?.amount));
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ShopVista
          </span>
        </a>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded `}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className={`block py-2 px-3 rounded `}>
                WishList
              </Link>
            </li>
            <li>
              <Link to="/faq" className={`block py-2 px-3 rounded `}>
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <div className="mr-4 relative">
            <BsBookmarkHeartFill
              size={23}
              className="flex-shrink-0  text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => {
                navigate("/wishlist");
                return;
              }}
            />
            {numOfWhishlistItems > 0 && (
              <span className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -end-3 dark:border-gray-900">
                {numOfWhishlistItems}
              </span>
            )}
          </div>
          <div className="mr-4 relative">
            <FaCartShopping
              size={23}
              className="flex-shrink-0  text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={handleCartClick}
            />
            {numOfCartItems > 0 && (
              <span className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -end-3 dark:border-gray-900">
                {numOfCartItems}
              </span>
            )}
          </div>
          <div className="mr-4 relative">
            <IoMdWallet
              size={26}
              className="flex-shrink-0  text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={handleWalletClick}
              // onClick={handleCartClick}
            />
            {/* Wallet dropdown */}
            {isWalletOpen && (
              <div className="absolute top-10 right-0 z-50 mt-2 py-2 w-48 bg-white rounded-md shadow-xl dark:bg-gray-800 dark:text-white">
                <div className="py-1">
                  <p className="block px-4 py-2 text-sm text-gray-700">
                    Wallet Amount: ${amount}
                  </p>
                  {/* Button to add more money */}
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={OpenModal}
                  >
                    Add Money
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      return navigate("/transaction");
                    }}
                  >
                    Transaction History
                  </button>
                </div>
              </div>
            )}
            {/* {numOfCartItems > 0 && (
              <span className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -end-3 dark:border-gray-900">
                {numOfCartItems}
              </span>
            )} */}
          </div>
          <div className="flex items-center ms-3">
            <div>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  onClick={handleProfileOpen}
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>
            </div>
            {isProfileOpen && (
              <div
                className=" absolute top-10 right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-user"
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="text-sm text-gray-900 dark:text-white"
                    role="none"
                  >
                    {name}
                  </p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                    role="none"
                  >
                    {email}
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/order"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e) => handleLogOut(e)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-300 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Cart isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      <AddWalletModal
        isOpen={isModalOpen}
        onClose={closeModal}
        addAmount={addAmount}
        setAddAmount={setAddAmount}
      />
    </nav>
  );
};

export default Header;
