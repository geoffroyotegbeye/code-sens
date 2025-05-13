import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Note: Vous devrez installer cette dépendance avec npm install @tinymce/tinymce-react
import { Loader, Image } from 'lucide-react';
import { blogApi } from '../services/blogApi';
import { uploadApi } from '../services/uploadApi';
import { BlogPostUpdate, BlogPost } from '../types/blog';
import { categories } from '../data/categories';

// Définition de l'interface Editor pour éviter l'erreur d'importation
interface EditorProps {
  apiKey?: string;
  value: string;
  init?: any;
  onEditorChange: (content: string) => void;
}

// Composant Editor temporaire jusqu'à l'installation de la dépendance
const Editor: React.FC<EditorProps> = ({ value, onEditorChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onEditorChange(e.target.value)}
      className="w-full p-4 border border-gray-300 rounded-md min-h-[500px]"
    />
  );
};

const EditBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Référence pour l'input de téléchargement d'image de couverture
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState<BlogPost>({
    _id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    author_id: '',
    category: '',
    tags: [],
    published_at: '',
    updated_at: '',
    author: {
      id: '',
      email: '',
      full_name: '',
      role: ''
    }
  });
  
  // Chargement de l'article à modifier
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const post = await blogApi.getPostBySlug(slug);
        setFormData(post);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        setError('Impossible de charger l\'article. Veuillez réessayer plus tard.');
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestionnaire de changement pour l'éditeur TinyMCE
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };
  
  // Gestionnaire de changement pour les tags
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags: tagsArray }));
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
      setFormData(prev => ({ ...prev, cover_image: imageUrl }));
      setIsCoverImageUploading(false);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image de couverture:', error);
      setError('Erreur lors du téléchargement de l\'image de couverture. Veuillez réessayer.');
      setIsCoverImageUploading(false);
    }
  };
  
  // Fonction pour télécharger une image depuis l'éditeur
  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    try {
      const file = blobInfo.blob();
      progress(10);
      
      const imageUrl = await uploadApi.uploadImage(file);
      
      progress(100);
      return imageUrl;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw new Error('Erreur lors du téléchargement de l\'image');
    }
  };
  
  // Fonction pour gérer le redimensionnement des images
  const setupImageResizeMenu = () => {
    // Cette fonction sera exécutée après le chargement de l'éditeur
    // Elle ajoute un menu contextuel pour redimensionner les images
    setTimeout(() => {
      const editor = (window as any).tinymce.activeEditor;
      if (!editor) return;
      
      // Ajouter un gestionnaire de clic pour les images
      editor.on('click', (e: any) => {
        const clickedElement = e.target;
        
        // Vérifier si l'élément cliqué est une image
        if (clickedElement.nodeName === 'IMG') {
          const currentImg = clickedElement;
          
          // Créer un menu flottant pour les options de taille
          const menu = document.createElement('div');
          menu.className = 'image-resize-menu';
          menu.style.position = 'absolute';
          menu.style.zIndex = '1000';
          menu.style.backgroundColor = '#fff';
          menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
          menu.style.borderRadius = '4px';
          menu.style.padding = '4px';
          
          // Positions du menu
          const imgRect = currentImg.getBoundingClientRect();
          const editorRect = editor.getContentAreaContainer().getBoundingClientRect();
          
          menu.style.left = (imgRect.left - editorRect.left) + 'px';
          menu.style.top = (imgRect.top - editorRect.top - 40) + 'px';
          
          // Options de taille
          const sizes = [
            { label: 'Petit', value: 'small' },
            { label: 'Moyen', value: 'medium' },
            { label: 'Grand', value: 'large' },
            { label: 'Original', value: 'original' }
          ];
          
          // Stocker les dimensions originales
          if (!currentImg.getAttribute('data-original-width')) {
            currentImg.setAttribute('data-original-width', currentImg.width.toString());
          }
          
          // Créer les boutons pour chaque option
          sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.textContent = size.label;
            btn.style.margin = '2px';
            btn.style.padding = '4px 8px';
            btn.style.border = 'none';
            btn.style.backgroundColor = '#f0f0f0';
            btn.style.borderRadius = '2px';
            btn.style.cursor = 'pointer';
            btn.setAttribute('data-size', size.value);
            
            btn.addEventListener('click', () => {
              const size = btn.getAttribute('data-size');
              const originalWidth = parseInt(currentImg.getAttribute('data-original-width') || '0');
              
              // Définir la taille en fonction de l'option sélectionnée
              switch (size) {
                case 'small':
                  currentImg.style.width = '25%';
                  break;
                case 'medium':
                  currentImg.style.width = '50%';
                  break;
                case 'large':
                  currentImg.style.width = '75%';
                  break;
                case 'original':
                  currentImg.style.width = originalWidth ? `${originalWidth}px` : 'auto';
                  break;
              }
              
              // Supprimer le menu après la sélection
              menu.remove();
            });
            
            menu.appendChild(btn);
          });
          
          // Ajouter le menu à l'éditeur
          editor.getContentAreaContainer().appendChild(menu);
          
          // Supprimer le menu lorsqu'on clique ailleurs
          const handleClickOutside = (e: MouseEvent) => {
            if (!menu.contains(e.target as Node)) {
              menu.remove();
              document.removeEventListener('click', handleClickOutside);
            }
          };
          
          // Utiliser setTimeout pour éviter que l'événement actuel ne déclenche handleClickOutside
          setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
          }, 0);
        }
      });
    }, 500);
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug) {
      setError('Slug manquant. Impossible de mettre à jour l\'article.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Créer l'objet de mise à jour
      const postUpdate: BlogPostUpdate = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        cover_image: formData.cover_image,
        category: formData.category,
        tags: formData.tags
      };
      
      // Envoyer la mise à jour au serveur
      await blogApi.updatePost(slug, postUpdate);
      
      setSuccessMessage('Article mis à jour avec succès !');
      setIsSaving(false);
      
      // Rediriger vers la page de l'article après un court délai
      setTimeout(() => {
        navigate(`/blog/${slug}`);
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      setError('Erreur lors de la mise à jour de l\'article. Veuillez réessayer.');
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader size={40} className="animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modifier l'article</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
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
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Cover Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image de couverture
                </label>
                
                {/* Input caché pour le téléchargement de l'image de couverture */}
                <input
                  type="file"
                  ref={coverImageInputRef}
                  onChange={handleCoverImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Champ caché pour stocker l'URL de l'image */}
                <input
                  type="hidden"
                  name="cover_image"
                  value={formData.cover_image || ''}
                />
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={openCoverImageDialog}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center justify-center"
                    title="Télécharger une image depuis l'ordinateur"
                    disabled={isCoverImageUploading}
                  >
                    {isCoverImageUploading ? (
                      <>
                        <Loader size={20} className="animate-spin mr-2" />
                        Chargement...
                      </>
                    ) : formData.cover_image ? (
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
                {formData.cover_image && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">Image de couverture</p>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData(prev => ({ ...prev, cover_image: '' }));
                          setCoverImagePreview(null);
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                    <img
                      src={coverImagePreview || formData.cover_image}
                      alt="Aperçu de l'image de couverture"
                      className="w-full max-h-60 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>
              
              {/* Catégorie */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ex: javascript, react, web"
                />
              </div>
              
              {/* Contenu */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <Editor
                  apiKey="votre-cle-api-tinymce"
                  value={formData.content}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image | help',
                    images_upload_handler: handleImageUpload,
                    setup: (editor: any) => {
                      editor.on('init', setupImageResizeMenu);
                    }
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    'Mettre à jour l\'article'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPostPage;
