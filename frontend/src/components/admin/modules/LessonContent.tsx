import React from 'react';
import { FileText } from 'lucide-react';
import { Lesson } from '../../../types/course';

interface LessonContentProps {
  selectedLesson: Lesson | null;
  activeTab: 'content' | 'attachments';
  setActiveTab: (tab: 'content' | 'attachments') => void;
  getEmbedUrl: (url: string) => string;
}

const LessonContent: React.FC<LessonContentProps> = ({
  selectedLesson,
  activeTab,
  setActiveTab,
  getEmbedUrl,
}) => {
  if (!selectedLesson) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        Sélectionnez une leçon pour voir son contenu
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)] overflow-y-auto">
      {/* En-tête de la leçon */}
      <div className="p-6 border-b bg-white">
        <h2 className="text-xl font-bold text-gray-900">{selectedLesson.title}</h2>
        {selectedLesson.description && (
          <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
        )}
      </div>

      {/* Vidéo */}
      {selectedLesson.type === 'video' && selectedLesson.video_url && (
        <div className="p-6 border-b">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(selectedLesson.video_url)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}

      {/* Contenu de la leçon */}
      <div className="p-6">
        {/* Onglets */}
        <div className="border-b mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contenu
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attachments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pièces jointes
            </button>
          </nav>
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === 'content' ? (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{selectedLesson.content}</div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedLesson.attachments && selectedLesson.attachments.length > 0 ? (
              selectedLesson.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{attachment.name}</span>
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Télécharger
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucune pièce jointe disponible
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
