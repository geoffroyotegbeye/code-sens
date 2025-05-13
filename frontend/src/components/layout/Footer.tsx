import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tighter">
                Code<span className="text-teal-400">&amp;</span>Sens
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Formations en développement et mentorat personnalisé pour vous aider à progresser 
              dans votre carrière. Maîtrisez les compétences nécessaires pour réussir dans le 
              monde numérique d'aujourd'hui.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                  Toutes les formations
                </Link>
              </li>
              <li>
                <Link to="/mentoring" className="text-gray-400 hover:text-white transition-colors">
                  Demande de mentorat
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:contact@codesens.com" className="hover:text-white transition-colors">
                  contact@codesens.com
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="pt-2">
                <p>42 Rue de l'Innovation</p>
                <p>75001 Paris, France</p>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Code&Sens. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-white transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;