import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import Order from "./pages/Order";

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
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
