import React from 'react';
import { Module } from '../../../types/course';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModule: Module | null;
  formData: {
    title: string;
    description: string;
  };
  setFormData: (data: { title: string; description: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditModuleModal: React.FC<EditModuleModalProps> = ({
  isOpen,
  onClose,
  selectedModule,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!isOpen || !selectedModule) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Modifier le Module</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModuleModal;
