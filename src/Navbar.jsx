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
                  
                </div>
            </div>
            {/* Mobile menu */}
            
        </nav>
    );
};

export default Navbar;
