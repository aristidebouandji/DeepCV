import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">À propos de DeepCV</h3>
            <p className="text-neutral-300 text-sm">
              DeepCV utilise l'intelligence artificielle pour optimiser votre CV 
              en fonction des offres d'emploi. Notre technologie analyse votre parcours 
              et les exigences du poste pour créer un CV parfaitement adapté.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  Créer un CV
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <p className="text-neutral-300 text-sm mb-4">
              Des questions ou des suggestions ? N'hésitez pas à nous contacter.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-neutral-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-neutral-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-neutral-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-700 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} DeepCV. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;