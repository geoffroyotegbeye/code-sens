import React, { useState } from 'react';
import { Download, FileText, Video, Image } from 'lucide-react';
import { Lesson } from '../../../types/course';
import Button from '../../ui/Button';

interface LessonContentProps {
  selectedLesson: Lesson | null;
}

const LessonContent: React.FC<LessonContentProps> = ({ selectedLesson }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'attachments'>('content');

  const getEmbedUrl = (url: string): string => {
    // Extraire l'ID de la vidéo YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo
    else if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    // Dailymotion
    else if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
      let dailyId = '';
      if (url.includes('dailymotion.com/video/')) {
        dailyId = url.split('dailymotion.com/video/')[1].split('?')[0];
      } else if (url.includes('dai.ly/')) {
        dailyId = url.split('dai.ly/')[1].split('?')[0];
      }
      return `https://www.dailymotion.com/embed/video/${dailyId}`;
    }
    return url;
  };

  if (!selectedLesson) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Sélectionnez une leçon</h3>
          <p className="text-gray-500">
            Choisissez une leçon dans la liste des modules pour commencer à apprendre.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Contenu
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'attachments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('attachments')}
          >
            Pièces jointes {selectedLesson.attachments && selectedLesson.attachments.length > 0 && `(${selectedLesson.attachments.length})`}
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
        <p className="text-gray-500 mb-6">{selectedLesson.duration} minutes</p>

        {activeTab === 'content' ? (
          <div>
            {selectedLesson.type === 'video' ? (
              (selectedLesson.videoUrl || selectedLesson.video_url) ? (
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <iframe
                    src={getEmbedUrl(selectedLesson.videoUrl || selectedLesson.video_url || '')}
                    className="w-full h-96 rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedLesson.title}
                  ></iframe>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
                  <p className="text-gray-600">
                    Aucune vidéo n'est disponible pour cette leçon. Veuillez consulter le contenu textuel ci-dessous.
                  </p>
                </div>
              )
            ) : null}

            <div className="prose max-w-none">
              {selectedLesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
              ) : (
                <p className="text-gray-500">Aucun contenu textuel disponible pour cette leçon.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Pièces jointes</h3>
            {selectedLesson.attachments && selectedLesson.attachments.length > 0 ? (
              <div className="space-y-3">
                {selectedLesson.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      {attachment.name.toLowerCase().endsWith('.pdf') ? (
                        <FileText className="text-red-500 mr-3" size={20} />
                      ) : attachment.name.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|mkv)$/) ? (
                        <Video className="text-blue-500 mr-3" size={20} />
                      ) : attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|webp)$/) ? (
                        <Image className="text-green-500 mr-3" size={20} />
                      ) : (
                        <FileText className="text-gray-500 mr-3" size={20} />
                      )}
                      <span>{attachment.name}</span>
                    </div>
                    <a
                      href={attachment.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download size={14} />
                        Télécharger
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-2">Aucune pièce jointe disponible pour cette leçon.</p>
                <p className="text-sm text-gray-400">Les pièces jointes peuvent inclure des documents PDF, des images, des vidéos ou d'autres ressources complémentaires.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
