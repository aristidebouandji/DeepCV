import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { useCVContext } from '../../context/CVContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { dispatch } = useCVContext();
  
  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={handleReset}>
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-800">DeepCV</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              Accueil
            </Link>
            <Link to="/input" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              Créer
            </Link>
            <a href="#about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors">
              À propos
            </a>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/input"
              className="block pl-3 pr-4 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Créer
            </Link>
            <a
              href="#about"
              className="block pl-3 pr-4 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;