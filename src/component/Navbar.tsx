import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Domino's Tracker
              </h1>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">Home</Link>
          <Link to="/delivery" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">Delivery</Link>
          <Link to="/checkout" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">checkout</Link>
          <Link to="/shift" className="text-gray-800 dark:text-gray-200 hover:text-blue-500">ShiftTracker</Link>
        </div>

        <div className="lg:hidden flex items-center space-x-4">
       
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-800 dark:text-gray-200">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900">
          <Link onClick={() => setMenuOpen(false)}  to="/" className="block text-gray-800 dark:text-gray-200">Home</Link>
          <Link onClick={() => setMenuOpen(false)}  to="/delivery" className="block text-gray-800 dark:text-gray-200">Delivery</Link>
          <Link onClick={() => setMenuOpen(false)}  to="/checkout" className="block text-gray-800 dark:text-gray-200">checkout</Link>
          <Link onClick={() => setMenuOpen(false)}  to="/shift" className="block text-gray-800 dark:text-gray-200">ShiftTracker</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
