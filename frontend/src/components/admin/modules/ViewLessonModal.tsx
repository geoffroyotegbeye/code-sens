import React from 'react';
import { X } from 'lucide-react';
import { Lesson } from '../../../types/course';

interface ViewLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

const ViewLessonModal: React.FC<ViewLessonModalProps> = ({
  isOpen,
  onClose,
  lesson,
}) => {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{lesson.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          {lesson.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className="text-gray-600">{lesson.description}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Contenu</h3>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Type</h3>
              <p className="text-gray-600 capitalize">{lesson.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Durée</h3>
              <p className="text-gray-600">{lesson.duration} minutes</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Ordre</h3>
              <p className="text-gray-600">{lesson.order}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Statut</h3>
              <p className="text-gray-600">
                {lesson.is_active ? 'Actif' : 'Inactif'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Créé le :</span>{' '}
              {new Date(lesson.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Mis à jour le :</span>{' '}
              {new Date(lesson.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLessonModal;
