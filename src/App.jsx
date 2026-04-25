import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import Order from "./pages/Order";
import PersonalInfo from "./pages/PersonalInfo";
import OrderConfirmation from "./pages/OrderConfirmation";
import CategoryPage from "./pages/Category";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import DiscoveryPage from "./pages/Category";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/cart-page",
    element: <CartPage />,
  },
  {
    path: "/order/:productId",
    element: <Order />,
  },
  {
    path: "/cart-page/shipping-info",
    element: <PersonalInfo />,
  },
  {
    path: "/order-confirmation/:orderId",
    element: <OrderConfirmation />,
  },
  {
    path: "/discover-more",
    element: <DiscoveryPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/user-profile",
    element: <Profile />,
  },
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
