import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import MentoringRequestForm from '../components/mentoring/MentoringRequestForm';
import { MessageSquare, Calendar, GraduationCap, Target } from 'lucide-react';

const MentoringPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Mentorat personnalisé avec nos experts
            </h1>
            <p className="text-xl text-blue-100 mb-4">
              Bénéficiez d'un accompagnement sur mesure pour accélérer votre progression et atteindre vos objectifs.
            </p>
            <p className="text-blue-200">
              Nos sessions de mentorat sont conçues pour répondre à vos besoins spécifiques, que vous cherchiez des conseils techniques, un accompagnement de carrière ou une revue de code.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Benefits */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-8">Pourquoi choisir notre mentorat?</h2>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                      <MessageSquare size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Accompagnement personnalisé</h3>
                    <p className="text-gray-600">
                      Des sessions individuelles adaptées à vos besoins spécifiques et à votre niveau, avec un expert dans votre domaine.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                      <Calendar size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Flexibilité des horaires</h3>
                    <p className="text-gray-600">
                      Choisissez les dates et heures qui vous conviennent le mieux pour organiser vos sessions de mentorat.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                      <GraduationCap size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expertise reconnue</h3>
                    <p className="text-gray-600">
                      Nos mentors sont des professionnels expérimentés, reconnus dans leur domaine et passionnés par la transmission de connaissances.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                      <Target size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Résultats concrets</h3>
                    <p className="text-gray-600">
                      Définissez des objectifs clairs et obtenez des résultats tangibles grâce à un suivi régulier et des conseils pratiques.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Témoignage</h3>
                <blockquote className="italic text-gray-700 mb-4">
                  "Les sessions de mentorat m'ont permis de surmonter les obstacles techniques que je rencontrais sur mon projet. Mon mentor m'a guidé vers les bonnes pratiques et m'a aidé à structurer ma démarche. Un vrai accélérateur de progression!"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src="https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Jean Dupont" 
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="font-medium">Jean Dupont</p>
                    <p className="text-sm text-gray-500">Développeur Full Stack</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-8">Réserver une session</h2>
              <MentoringRequestForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Questions fréquentes</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Comment se déroule une session de mentorat?</h3>
                <p className="text-gray-600">
                  Les sessions se déroulent par visioconférence et durent généralement entre 45 minutes et 1 heure. Vous pouvez discuter de vos objectifs, poser vos questions et recevoir des conseils personnalisés. Selon vos besoins, il peut y avoir des sessions de suivi.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Combien coûte une session de mentorat?</h3>
                <p className="text-gray-600">
                  Le tarif dépend du type de mentorat et de l'expertise requise. Vous recevrez les détails tarifaires après l'évaluation initiale de votre demande. Des forfaits multi-sessions sont disponibles pour un suivi sur la durée.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Puis-je changer de mentor si nécessaire?</h3>
                <p className="text-gray-600">
                  Oui, nous souhaitons que votre expérience soit la plus bénéfique possible. Si vous sentez que le mentor actuel ne correspond pas parfaitement à vos besoins, nous pouvons vous proposer d'autres experts dans le domaine qui vous intéresse.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Comment annuler ou reporter une session?</h3>
                <p className="text-gray-600">
                  Vous pouvez annuler ou reporter votre session jusqu'à 24 heures avant l'heure prévue sans frais. Pour cela, utilisez simplement le lien dans l'email de confirmation ou contactez-nous directement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default MentoringPage;