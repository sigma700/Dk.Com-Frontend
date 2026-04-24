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
    path: "/category",
    element: <CategoryPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
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
