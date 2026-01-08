import { Link } from 'react-router-dom';
import Logo from "../../assets/Logo-DarkText.png";

export default function MenuBar({ onOpenForm }) {
    const handleScrollTop = () => {
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };

    return (
        <nav className="sticky top-8 z-50 left-0 right-0 flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 py-3 bg-white/50 backdrop-blur-md rounded-full shadow
        w-10/12 sm:w-9/12 md:w-9/12 lg:w-10/12">
            <div onClick={handleScrollTop} className='cursor-pointer'>
                <img
                    src={Logo}
                    alt="Description"
                    className="h-8 object-contain pr-2 sm:pr-0"
                />
            </div>
            <Link to="/#waitlist">
            <button 
                onClick={onOpenForm}
                className="hidden sm:block
                text-white font-bold px-5 py-1 rounded-full shadow-md
                bg-gradient-to-r from-brand-primary from-40% to-brand-secondary
                hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
            Join the Waitlist
            </button>
            <button 
                onClick={onOpenForm}
                className="block sm:hidden
                text-white font-bold px-5 py-1 rounded-full shadow-md
                bg-gradient-to-r from-brand-primary from-40% to-brand-secondary
                hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
            Waitlist
            </button>
            </Link>
        </nav>
    )
}