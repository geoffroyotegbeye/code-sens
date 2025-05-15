import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  isReply?: boolean;
  isEditing?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Ajouter un commentaire...',
  submitLabel = 'Envoyer',
  isReply = false,
  isEditing = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    onSubmit(content);
    
    // Ne pas réinitialiser le contenu si on est en mode édition
    // car le parent va probablement démonter ce composant
    if (!isEditing) {
      setContent('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`mb-4 ${isReply ? 'ml-6 mt-2' : ''}`}>
      <div className={`bg-white rounded-lg ${isReply || isEditing ? 'border border-blue-200' : 'shadow-md'} p-4`}>
        {isReply && (
          <div className="text-sm text-blue-600 mb-2">
            Répondre à un commentaire
          </div>
        )}
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={isReply ? 3 : 4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          required
        />
        
        <div className="flex justify-end mt-2 space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 flex items-center text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X size={16} className="mr-1" />
              Annuler
            </button>
          )}
          
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`px-4 py-1 flex items-center text-white rounded-md ${
              !content.trim() || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send size={16} className="mr-1" />
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
