import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Module, Lesson } from '../../../types/course';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModule: Module | null;
  selectedLesson: Lesson | null;
  isEditing: boolean;
  lessonFormData: {
    title: string;
    description: string;
    content: string;
    duration: number;
    type: 'video' | 'text' | 'quiz';
    videoUrl: string;
    attachments: File[];
  };
  setLessonFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: (index: number) => void;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  selectedModule,
  selectedLesson,
  isEditing,
  lessonFormData,
  setLessonFormData,
  onSubmit,
  handleFileChange,
  removeAttachment,
}) => {
  if (!isOpen || !selectedModule) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Modifier la Leçon' : 'Nouvelle Leçon'}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={lessonFormData.title}
              onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={lessonFormData.description}
              onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (optionnel)</label>
            <textarea
              value={lessonFormData.content}
              onChange={(e) => setLessonFormData({ ...lessonFormData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
            <input
              type="number"
              value={lessonFormData.duration}
              onChange={(e) => setLessonFormData({ ...lessonFormData, duration: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de contenu</label>
            <select
              value={lessonFormData.type}
              onChange={(e) => setLessonFormData({ 
                ...lessonFormData, 
                type: e.target.value as 'video' | 'text' | 'quiz',
                videoUrl: e.target.value !== 'video' ? '' : lessonFormData.videoUrl,
              })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="video">Vidéo</option>
              <option value="text">Texte</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          {/* Champs spécifiques pour les vidéos */}
          {lessonFormData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la vidéo</label>
              <input
                type="url"
                value={lessonFormData.videoUrl}
                onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
                required
              />
            </div>
          )}

          {/* Section pour les pièces jointes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pièces jointes (optionnel)</label>
            <div className="mt-2">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus size={16} className="mr-2" />
                Ajouter des fichiers
              </label>
            </div>

            {/* Liste des fichiers sélectionnés */}
            {lessonFormData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {lessonFormData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;
