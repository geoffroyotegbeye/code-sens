import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    formations: [
      { name: 'Toutes les formations', path: '/courses' },
    ],
    ressources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Tutoriels', path: '/tutorials' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Support', path: '/support' },
    ],
    entreprise: [
      { name: 'À propos', path: '/about' },
      { name: 'Carrières', path: '/careers' },
      { name: 'Contact', path: '/contact' },
      { name: 'Mentions légales', path: '/legal' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-teal-600">
                WebRichesse
              </span>
            </Link>
            <p className="text-sm">
              Votre partenaire pour l'excellence en développement web. Formations de qualité
              et opportunités de carrière pour tous.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Formations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Formations</h3>
            <ul className="space-y-2">
              {footerLinks.formations.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.ressources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:contact@webrichesse.com" className="text-sm hover:text-white transition-colors">
                  contact@webrichesse.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <a href="tel:+33123456789" className="text-sm hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1" />
                <span className="text-sm">
                  123 Rue de l'Innovation<br />
                  75001 Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {currentYear} WebRichesse. Tous droits réservés.
          </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
              <Link to="/terms" className="text-sm hover:text-white transition-colors">
                Conditions d'utilisation
            </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;