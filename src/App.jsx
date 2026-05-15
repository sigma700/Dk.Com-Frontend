import React from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
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
import ProtectedRoute from "./components/protectedRoute";
import LoginPage from "./pages/Loginpage";
import ContactPage from "./pages/Contacts";
import Faqs from "./pages/Faqs";

// ─── Layout wrapper ───────────────────────────────────────────────────────────
// NavBar (which contains MobileMenu) must render INSIDE the RouterProvider
// so that Link / useLocation / useNavigate have access to the router context.
// All routes are children of this layout via <Outlet />.
const RootLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {path: "/", element: <LandingPage />},
      {path: "/cart-page", element: <CartPage />},
      {path: "/order/:productId", element: <Order />},
      {path: "/cart-page/shipping-info", element: <PersonalInfo />},
      {path: "/order-confirmation/:orderId", element: <OrderConfirmation />},
      {path: "/discover-more", element: <DiscoveryPage />},
      {path: "/about", element: <AboutPage />},
      {path: "/blog", element: <BlogPage />},
      {path: "/create-acc", element: <CreateAccountPage />},
      {path: "/verify-email", element: <VerifyEmailPage />},
      {path: "/login", element: <LoginPage />},
      {path: "/contact", element: <ContactPage />},
      {path: "/faqs", element: <Faqs />},
      {
        path: "/user-profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => (
  <main>
    <RouterProvider router={router} />
  </main>
);

export default App;
