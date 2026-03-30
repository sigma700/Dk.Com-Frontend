import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
