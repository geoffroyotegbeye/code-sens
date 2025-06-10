import React from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>À propos | Mon Portfolio</title>
        <meta name="description" content="Découvrez mon parcours, mes compétences et mes projets" />
      </Helmet>

      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-20 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Geoffroy Otegbeye</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
            Développeur web passionné et entrepreneur digital
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-900">À propos de moi</h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  Bienvenue sur mon portfolio ! Je suis Geoffroy Otegbeye, un développeur web et entrepreneur digital 
                  passionné par la création de solutions numériques innovantes.
                </p>
                <p>
                  Avec plusieurs années d'expérience dans le développement web et le marketing digital, 
                  je me spécialise dans la création d'applications web modernes et performantes qui 
                  aident les entreprises à atteindre leurs objectifs.
                </p>
                <p>
                  Ma philosophie est simple : combiner expertise technique, créativité et stratégie 
                  pour développer des solutions qui génèrent de la valeur réelle.
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Mes compétences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Développement Frontend</h4>
                    <p className="text-gray-600">React, TypeScript, Tailwind CSS</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Développement Backend</h4>
                    <p className="text-gray-600">Node.js, Express, MongoDB</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">E-commerce</h4>
                    <p className="text-gray-600">Stratégies de vente, optimisation de conversion</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Marketing Digital</h4>
                    <p className="text-gray-600">SEO, content marketing, email marketing</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-900">Mes projets</h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Web Richesse</h3>
                  <p className="text-gray-600 mb-4">
                    Plateforme éducative pour aider les entrepreneurs à développer leurs compétences 
                    en marketing digital et e-commerce.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="primary" className="text-white">
                      Voir le projet
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">E-commerce Dashboard</h3>
                  <p className="text-gray-600 mb-4">
                    Solution de tableau de bord pour les propriétaires de boutiques en ligne, 
                    offrant des analyses avancées et des outils d'optimisation.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="primary" className="text-white">
                      Voir le projet
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Marketing Automation Tool</h3>
                  <p className="text-gray-600 mb-4">
                    Outil d'automatisation du marketing pour les PME, permettant de gérer 
                    les campagnes email, les médias sociaux et le contenu.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="primary" className="text-white">
                      Voir le projet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center text-blue-900">Me contacter</h2>
          
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Sujet de votre message"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre message..."
                ></textarea>
              </div>
              
              <div>
                <Button type="submit" fullWidth className="text-white">
                  Envoyer le message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
