import React from "react";
import {IoIosSearch} from "react-icons/io";
import {CiShoppingCart} from "react-icons/ci";
import {FaRegUserCircle} from "react-icons/fa";
import HamburgerMenu from "../components/menu";
const LandingPage = () => {
  const navLinks = [
    {label: "Home", href: "#"},
    {label: "Category", href: "#"},
    {label: "About Us", href: "#"},
    {label: "FAQs", href: "#"},
    {label: "Blog", href: "#"},
  ];
  return (
    <main className="container">
      {/* nav section */}
      <section className="p-[20px]">
        <nav className="lg:flex items-center justify-between hidden">
          <img src="" alt="" />
          <ul className="flex gap-[40px]">
            <li>Home</li>
            <li>About Us</li>
            <li>FAQs</li>
            <li>Blog</li>
            <li>Contacts</li>
          </ul>
          <div className="icons-section flex gap-[20px]">
            <IoIosSearch />
            <CiShoppingCart />
            <FaRegUserCircle />
          </div>
        </nav>
        <nav className="lg:hidden block-0">
          <HamburgerMenu links={navLinks} onNav={(href) => console.log(href)} />
        </nav>
      </section>
    </main>
  );
};

export default LandingPage;
