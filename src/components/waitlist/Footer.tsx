import { Link } from "react-router-dom";
import Logo from "../../assets/icon_logo.png"; 

const Footer = ({ onOpenForm }) => {
  return (
    <footer className="bg-white py-10 sm:py-28 font-heading">
      <div className="mx-auto flex flex-col items-center space-y-6">

        <img src={Logo} alt="Nimbus+" className="ml-2 h-12 sm:h-16" />

        {/* Navigation */}
        <nav className="flex space-x-12 text-gray-700 font-medium">
          <Link to="/#features" className="hover:text-brand-primary transition">
            Features
          </Link>
          <button className="hover:text-brand-primary transition" onClick={onOpenForm}>   
            Waitlist
          </button>
        </nav>

        {/* <div className="flex flex-col items-center justify-center md:flex-row md:space-x-6 text-gray-400 text-sm sm:mt-4 space-y-2 md:space-y-0">
          <a href="#privacy" className="hover:text-gray-600 transition">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-gray-600 transition">
            Terms of Service
          </a>
        </div> */}

        {/* Copyright */}
        <p className="text-gray-400 text-xs sm:mt-4">
          &copy; 2025 Nimbus+. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
