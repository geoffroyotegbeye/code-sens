import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import CourseList from '../components/courses/CourseList';
import Button from '../components/ui/Button';
import { courses, categories } from '../data/mockData';

const HomePage: React.FC = () => {
  // Get featured courses
  const featuredCourses = courses.filter(course => course.featured);
  
  // Get newest courses (using the createdAt date)
  const newestCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-900/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Développez vos compétences<br />avec <span className="text-teal-400">Code</span>&amp;<span className="text-teal-400">Sens</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Des formations de qualité et un mentorat personnalisé pour vous accompagner dans votre parcours professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button size="lg">Explorer les formations</Button>
              </Link>
              <Link to="/mentoring">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
                  Demander un mentorat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <CourseList
            courses={featuredCourses}
            title="Formations recommandées"
            subtitle="Découvrez nos formations les plus populaires, sélectionnées pour leur qualité et leur pertinence."
          />
          
          <div className="text-center mt-10">
            <Link to="/courses">
              <Button variant="outline" className="group">
                Voir toutes les formations
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trouvez la formation qui correspond à vos besoins parmi nos différentes catégories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/courses?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{category.count} formations</span>
                  <ArrowRight size={18} className="text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <CourseList
            courses={newestCourses}
            title="Nouveautés"
            subtitle="Les dernières formations ajoutées à notre catalogue pour rester à jour sur les dernières technologies."
          />
        </div>
      </section>

      {/* Mentoring CTA Section */}
      <section className="py-16 bg-teal-600 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                Besoin d'un accompagnement personnalisé?
              </h2>
              <p className="text-white">
                Profitez de sessions de mentorat individuel avec nos experts pour accélérer votre progression.
              </p>
            </div>
            <Link to="/mentoring">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
                Réserver une session
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos étudiants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les retours d'expérience de ceux qui ont suivi nos formations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Sophie Martin" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Sophie Martin</h4>
                  <p className="text-sm text-gray-600">Développeuse Front-end</p>
                </div>
              </div>
              <p className="text-gray-700">
                "La formation React était exactement ce dont j'avais besoin pour faire évoluer mes compétences. Les explications claires et les exercices pratiques m'ont permis de progresser rapidement."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Thomas Legrand" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Thomas Legrand</h4>
                  <p className="text-sm text-gray-600">Entrepreneur Tech</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Le mentorat m'a beaucoup aidé à structurer mon projet d'application mobile. Les conseils personnalisés ont vraiment fait la différence dans mon parcours entrepreneurial."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Léa Dubois" 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Léa Dubois</h4>
                  <p className="text-sm text-gray-600">Analyste de données</p>
                </div>
              </div>
              <p className="text-gray-700">
                "La formation Python pour l'analyse de données est très complète. J'ai particulièrement apprécié la pédagogie du formateur et la qualité des ressources fournies."
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;