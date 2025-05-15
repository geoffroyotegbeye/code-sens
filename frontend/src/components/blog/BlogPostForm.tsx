import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { Image, Loader } from 'lucide-react';
import { uploadApi } from '../../services/uploadApi';
import { categoryService } from '../../services/categoryApi';
import toast from 'react-hot-toast';

import RichTextEditor from '../editor/RichTextEditor';

// Suggestions de tags prédéfinis
const tagSuggestions = [
  'JavaScript', 'React', 'TypeScript', 'Vue.js', 'Angular',
  'Node.js', 'Express', 'MongoDB', 'SQL', 'PHP', 'Laravel',
  'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'DevOps',
  'Frontend', 'Backend', 'Fullstack', 'Mobile', 'Web', 'Desktop'
];

interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
}

interface BlogPostFormProps {
  initialData: BlogPostFormData;
  isSubmitting: boolean;
  onSubmit: (formData: BlogPostFormData) => void;
  submitButtonText: string;
  cancelButtonText: string;
  onCancel: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  initialData,
  isSubmitting,
  onSubmit,
  submitButtonText,
  cancelButtonText,
  onCancel
}) => {
  const [formData, setFormData] = useState<BlogPostFormData>(initialData);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData.coverImage || null);
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  
  // Charger les catégories depuis le backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoryError(null);
        const categoriesData = await categoryService.getAllCategories();
        
        // Transformer les données pour le format attendu par le select
        const formattedCategories = categoriesData.map(cat => ({
          value: cat.name,
          label: cat.name
        }));
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategoryError('Impossible de charger les catégories. Veuillez réessayer.');
        toast.error('Erreur lors du chargement des catégories');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Gestionnaire de changement pour les champs de formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour ouvrir la boîte de dialogue de sélection d'image de couverture
  const openCoverImageDialog = () => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.click();
    }
  };

  // Gestionnaire de changement pour l'image de couverture
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsCoverImageUploading(true);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Télécharger l'image
      const imageUrl = await uploadApi.uploadImage(file);
      
      // Mettre à jour l'état du formulaire avec l'URL de l'image
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      setIsCoverImageUploading(false);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image de couverture:', error);
      toast.error('Erreur lors du téléchargement de l\'image de couverture. Veuillez réessayer.');
      setIsCoverImageUploading(false);
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">          
          {/* Colonne gauche (2/5) - Champs du formulaire */}
          <div className="md:col-span-2 space-y-6">
            {/* Titre */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Titre de l'article"
              />
            </div>

            {/* Extrait */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                Extrait
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bref résumé de l'article"
                rows={3}
              />
            </div>

            {/* Image de couverture */}
            <div className="mb-6">
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Image de couverture
              </label>
              <input
                type="file"
                ref={coverImageInputRef}
                onChange={handleCoverImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="mt-1">
                <button
                  type="button"
                  onClick={openCoverImageDialog}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center"
                >
                  {isCoverImageUploading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Chargement...
                    </>
                  ) : formData.coverImage ? (
                    <>
                      <Image size={20} className="mr-2" />
                      Changer l'image de couverture
                    </>
                  ) : (
                    <>
                      <Image size={20} className="mr-2" />
                      Sélectionner une image de couverture
                    </>
                  )}
                </button>
              </div>
              
              {/* Aperçu de l'image de couverture */}
              {(formData.coverImage || coverImagePreview) && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Image de couverture</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, coverImage: '' }));
                        setCoverImagePreview(null);
                      }}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                  <img
                    src={formData.coverImage ? uploadApi.getImageUrl(formData.coverImage) : coverImagePreview || ''}
                    alt="Aperçu de l'image de couverture"
                    className="w-full max-h-60 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              {isLoadingCategories ? (
                <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm text-gray-500">Chargement des catégories...</span>
                </div>
              ) : categoryError ? (
                <div className="p-2 border border-red-300 rounded-md bg-red-50">
                  <p className="text-sm text-red-500">{categoryError}</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      const fetchCategories = async () => {
                        try {
                          setIsLoadingCategories(true);
                          setCategoryError(null);
                          const categoriesData = await categoryService.getAllCategories();
                          const formattedCategories = categoriesData.map(cat => ({
                            value: cat.name,
                            label: cat.name
                          }));
                          setCategories(formattedCategories);
                        } catch (error) {
                          console.error('Erreur lors du chargement des catégories:', error);
                          setCategoryError('Impossible de charger les catégories. Veuillez réessayer.');
                        } finally {
                          setIsLoadingCategories(false);
                        }
                      };
                      fetchCategories();
                    }}
                    className="mt-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, JavaScript, Tutorial"
              />
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Suggestions de tags :</p>
                <div className="flex flex-wrap gap-1">
                  {tagSuggestions.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
                        if (!currentTags.includes(tag)) {
                          const newTags = [...currentTags, tag].join(', ');
                          setFormData(prev => ({ ...prev, tags: newTags }));
                        }
                      }}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                {cancelButtonText}
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="text-white"
              >
                {submitButtonText}
              </Button>
            </div>
          </div>
          
          {/* Colonne droite (3/5) - Éditeur de contenu */}
          <div className="md:col-span-3 space-y-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenu
            </label>
            
            {/* Notre éditeur de texte riche personnalisé */}
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Contenu de l'article..."
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogPostForm;
