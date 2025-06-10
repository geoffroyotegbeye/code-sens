import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Users, Sparkles, BookOpen, Briefcase, Trophy, Star, Clock, Shield } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import CourseList from '../components/courses/CourseList';
import ContactForm from '../components/contact/ContactForm';

const HomePage: React.FC = () => {
  const featuredCourses = [
    {
      id: '1',
      title: 'Introduction au Développement Web',
      description: 'Apprenez les bases du HTML, CSS et JavaScript',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      category: 'Développement Web',
      level: 'Débutant',
      duration: '6 semaines',
      price: '49.99',
      instructor: 'Geoffroy Otegbeye',
      modules: [],
      enrollmentCount: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const services = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Formations Complètes",
      description: "Des parcours d'apprentissage structurés du débutant à l'expert"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Accompagnement Carrière",
      description: "Conseils et mentorat pour votre développement professionnel"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Projets Pratiques",
      description: "Mettez en pratique vos connaissances sur des cas réels"
    }
  ];

  const stats = [
    { number: "10+", label: "Formations en Préparation" },
    { number: "3+", label: "Experts Formateurs" },
    { number: "100%", label: "Engagement Qualité" },
    { number: "24/7", label: "Support Étudiant" }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-blue-900 text-white overflow-hidden pt-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-blue-900/90" />
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Votre Avenir Numérique<br />
                <span className="text-teal-400">Commence Ici</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                La première plateforme de formation tech en Afrique, dédiée aux femmes et aux enfants. 
                Transformez votre passion en carrière.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-lg px-8 py-4">
                    Commencer Maintenant
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4">
                    Découvrir WebRichesse
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Étudiants en formation" 
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full max-w-[600px] h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/150?img=${i + 10}`}
                          alt={`Étudiant ${i}`}
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">1000+</span> apprenants actifs
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-teal-500 text-white p-4 rounded-xl shadow-lg z-30">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">95%</div>
                    <div className="text-sm">Taux de satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-24 text-white"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path
              d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
              className="fill-current"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une approche complète pour votre réussite dans le monde du numérique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="text-teal-500 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Women in Tech Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Women in Tech
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Des formations adaptées pour les femmes qui souhaitent se lancer dans le développement web. 
                De débutante à experte, nous vous accompagnons dans votre parcours.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Mentorat personnalisé avec des expertes
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Communauté de soutien active
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Projets concrets et portfolio
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Accompagnement vers l'emploi
                </li>
              </ul>
              <Link to="/courses?category=women">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Découvrir les formations
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Women in Tech" 
                className="rounded-2xl shadow-2xl w-full max-w-[600px] h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kids Code Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Kids Code" 
                className="rounded-2xl shadow-2xl w-full max-w-[600px] h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Kids Code
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Initiez vos enfants à la programmation de manière ludique et créative. 
                Des cours adaptés pour les 8-15 ans.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Apprentissage ludique et interactif
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Projets créatifs et amusants
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Suivi parental détaillé
                </li>
                <li className="flex items-center text-gray-700">
                  <Sparkles className="w-5 h-5 text-teal-500 mr-3" />
                  Certificats de réussite
                </li>
              </ul>
              <Link to="/courses?category=kids">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                  Découvrir les cours
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Formations Populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos formations les plus appréciées par notre communauté
            </p>
          </div>
          
          <CourseList
            courses={featuredCourses}
            title=""
            subtitle=""
          />
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
                Voir toutes les formations
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Transformer Votre Avenir ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez notre communauté et commencez votre voyage dans le monde du code dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-4">
                  Commencer Gratuitement
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4">
                  Explorer les Formations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une question ? Un projet ? N'hésitez pas à nous contacter, nous sommes là pour vous aider.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;