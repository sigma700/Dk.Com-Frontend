import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import Order from "./pages/Order";
import PersonalInfo from "./pages/PersonalInfo";
import OrderConfirmation from "./pages/OrderConfirmation";
import DiscoveryPage from "./pages/Category";
import AboutPage from "./pages/About";
import BlogPage from "./pages/Blog";
import Profile from "./pages/Profile";
import CreateAccountPage from "./pages/CreateAccountPage";
import VerifyEmailPage from "./pages/Verifymail";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- import
import LoginPage from "./pages/Loginpage";
import Contacts from "./pages/Contacts";
import ContactPage from "./pages/Contacts";

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
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-acc",
    element: <CreateAccountPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/contact",
    element: <ContactPage />,
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
