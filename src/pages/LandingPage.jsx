import React from "react";
// import HamburgerMenu from "../components/menu";
import {Search, ShoppingCart, SquareUserRound} from "lucide-react";
import {AppleSearchAnimation} from "../utils/searchAnimation";
import HamburgerMenu from "../components/menu";
const LandingPage = () => {
  const navLinks = [
    {label: "Home", href: "#"},
    {label: "Category", href: "#"},
    {label: "About Us", href: "#"},
    {label: "FAQs", href: "#"},
    {label: "Blog", href: "#"},
  ];

  const navigators = ["Home", "About Us", "FAQs", "Blog", "Contacts"];
  return (
    <main className="container">
      {/* nav section */}
      <section className="p-[20px]">
        <nav className="lg:flex items-center justify-between hidden">
          <img src="" alt="logo-bs" />
          <ul className="flex gap-[40px] font-bold">
            {navigators.map((item) => (
              <li className="hover:text-amber-400 hover:cursor-pointer hover:duration-75 hover:transition-colors duration-[0.5s] active:text-black active:duration-100 active:transition-colors ">
                {item}
              </li>
            ))}
          </ul>
          <div className="icons-section flex gap-[20px] items-center">
            <AppleSearchAnimation />
            <ShoppingCart />
            <SquareUserRound />
          </div>
        </nav>
        <nav className="lg:hidden block flex justify-end">
          <HamburgerMenu links={navLinks} onNav={(href) => console.log(href)} />
        </nav>
      </section>
    </main>
  );
};

export default LandingPage;
