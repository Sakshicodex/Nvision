import React from 'react';
import { Link } from 'react-router-dom';
import Logo1 from './logo3.jpeg'; // Adjust the file names if needed
import Logo2 from './logo2.jpeg';

const Navbar = () => {
    const scrollToRegistrationForm = () => {
        const section = document.getElementById('registration-form-section');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center"> {/* Added items-center for vertical alignment */}
                    <div className="flex items-center"> {/* Removed space-x-7 to adjust spacing */}
                        {/* Left side logo */}
                        <Link to="/" className="flex items-center py-2 px-2"> {/* Adjusted padding for better alignment */}
                            <img src={Logo1} alt="Left Logo" style={{ maxHeight: '50px' }} /> {/* Set max-height for logos */}
                        </Link>
                        {/* Primary Navbar items */}
                        
                    </div>
                    {/* Right side logo */}
                    <div className="flex items-center">
                        <img src={Logo2} alt="Right Logo" style={{ maxHeight: '50px' }} /> {/* Set max-height for logos */}
                    </div>
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className="outline-none mobile-menu-button">
                            <svg className=" w-6 h-6 text-gray-500 hover:text-purple-600 "
                                x-show="!showMenu"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <div className="hidden mobile-menu">
                <ul className="">
                    <li><Link to="/" className="block text-sm px-2 py-4 text-gray-500 font-semibold">Home</Link></li>
                    <li className="block text-sm px-2 py-4 text-gray-500 font-semibold hover:bg-purple-500 transition duration-300 cursor-pointer"
                        onClick={scrollToRegistrationForm}>
                        Registration Form
                    </li>
                    <li><Link to="/abstract-submission" className="block text-sm px-2 py-4 hover:bg-purple-500 transition duration-300">Abstract Submission</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
