import React from "react";
import {AppleSearchAnimation} from "../utils/searchAnimation";
import {ShoppingCart, SquareUserRound} from "lucide-react";
import HamburgerMenu from "./menu";

const NavBar = () => {
  const navigators = ["Home", "About Us", "FAQs", "Blog", "Contacts"];
  const navLinks = [
    {label: "Home", href: "#"},
    {label: "Category", href: "#"},
    {label: "About Us", href: "#"},
    {label: "FAQs", href: "#"},
    {label: "Blog", href: "#"},
  ];
  return (
    <div>
      {/* nav section */}
      <section className="p-[20px]">
        <nav className="lg:flex items-center justify-between hidden">
          <img src="" alt="logo-bs" />
          <ul className="flex gap-[40px] font-bold">
            {navigators.map((item, idx) => (
              <li
                key={idx}
                className="hover:text-amber-400 hover:cursor-pointer hover:duration-75 hover:transition-colors duration-[0.5s] active:text-black active:duration-100 active:transition-colors"
              >
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
        <nav className="lg:hidden z-50 relative flex justify-end">
          <HamburgerMenu links={navLinks} onNav={(href) => console.log(href)} />
        </nav>
      </section>
    </div>
  );
};

export default NavBar;
