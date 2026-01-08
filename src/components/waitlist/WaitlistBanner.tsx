import React from "react";
import Line1 from '../../assets/Ellipse.png';
import Line2 from '../../assets/Ellipse2.png';

const WaitlistBanner: React.FC = ({ onOpenForm }) => {
  return (
    <div className="w-3/5 lg:w-4/5 lg:max-w-5xl xl:w-6xl rounded-xl bg-white py-20 lg:py-20 mt-10 mb-20 mx-auto text-center flex flex-col items-center justify-between left-0 relative overflow-hidden shadow-lg ">
        <img
            src={Line1}
            alt="Decorative Lines"
            className="hidden md:block sm:absolute z-0 w-40 h-full -left-1 -bottom-1"
        />
        <img
            src={Line2}
            alt="Decorative Lines"
            className="hidden md:block sm:absolute z-0 w-25 h-full -right-1 -bottom-1"
        />
        <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 mx-4 sm:mr-4 md:mb-0 sm:whitespace-nowrap">
            Start managing your project <br/> 
            with the <span className="text-brand-primary font-bold">right platform</span>.
        </h2>

        <p className="mt-2 mb-4 text-gray-600 text-[12px] mx-4 sm:text-md md:text-md lg:text-lg xl:text-xl font-heading">
            Streamline your design workflows and <br/> collaborate like never before.
        </p>

        <button
            type="submit"
            onClick={onOpenForm}
            className="
                text-white font-bold text-sm sm:text-lg xl:text-xl
                px-4 py-2 sm:px-8 sm:py-3 rounded-full shadow-md mt-5 xl:mt-0
                bg-gradient-to-r from-brand-primary from-40% to-brand-secondary
                cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out whitespace-nowrap" >
                Join the Waitlist
        </button>
    </div>
  );
};

export default WaitlistBanner;