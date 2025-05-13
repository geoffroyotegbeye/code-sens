import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/blogApi';
import { uploadApi } from '../services/uploadApi';
import { BlogPostUpdate, BlogPost } from '../types/blog';
import toast from 'react-hot-toast';
import { Image, Loader } from 'lucide-react';
import { categories } from '../data/categories';

const EditBlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // États pour le chargement et la soumission
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Références pour l'éditeur et les inputs de fichier
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  
  // États pour le téléchargement d'images
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
  });

  // Chargement de l'article à modifier
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        const post = await blogApi.getPostBySlug(slug);
        
        // Convertir les tags en chaîne de caractères séparée par des virgules
        const tagsString = post.tags.join(', ');
        
        // Mettre à jour le formulaire avec les données de l'article
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image || '',
          category: post.category,
          tags: tagsString,
        });
        
        // Si l'image de couverture existe, la définir comme aperçu
        if (post.cover_image) {
          setCoverImagePreview(post.cover_image);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        toast.error('Impossible de charger l\'article. Veuillez réessayer plus tard.');
        setIsLoading(false);
        
        // Rediriger vers la page de blog en cas d'erreur
        setTimeout(() => {
          navigate('/blog');
        }, 2000);
      }
    };
    
    fetchPost();
  }, [slug, navigate]);
  
  // Gestionnaire de changement pour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gestionnaire de changement pour l'éditeur
  const handleEditorChange = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };
  
  // Fonction pour ouvrir la boîte de dialogue de sélection d'image
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
  
  // Gestionnaire de téléchargement d'image dans l'éditeur
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;
    
    try {
      setIsUploading(true);
      
      // Télécharger l'image
      const imageUrl = await uploadApi.uploadImage(file);
      
      // Créer l'élément image
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'Image téléchargée';
      img.className = 'resizable-image';
      img.style.maxWidth = '100%';
      img.setAttribute('data-original-width', '100%');
      
      // Insérer l'image à la position du curseur
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents();
          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editorRef.current.appendChild(img);
        }
      } else {
        editorRef.current.appendChild(img);
      }
      
      // Mettre à jour le contenu du formulaire
      handleEditorChange();
      
      setIsUploading(false);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error('Erreur lors du téléchargement de l\'image. Veuillez réessayer.');
      setIsUploading(false);
    }
  };
  
  // Fonction pour rendre les images redimensionnables
  const makeImagesResizable = () => {
    if (!editorRef.current) return;
    
    // Sélectionner toutes les images dans l'éditeur
    const images = editorRef.current.querySelectorAll('img');
    
    images.forEach(img => {
      // Ajouter la classe pour les images redimensionnables
      img.classList.add('resizable-image');
      
      // Stocker les dimensions originales
      if (!img.getAttribute('data-original-width')) {
        img.setAttribute('data-original-width', img.width.toString());
      }
      
      // Ajouter un gestionnaire de clic pour les images
      img.addEventListener('click', (e) => {
        e.preventDefault();
        
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
        const imgRect = img.getBoundingClientRect();
        const editorRect = editorRef.current!.getBoundingClientRect();
        
        menu.style.left = (imgRect.left - editorRect.left) + 'px';
        menu.style.top = (imgRect.top - editorRect.top - 40) + 'px';
        
        // Options de taille
        const sizes = [
          { label: 'Petit', value: 'small' },
          { label: 'Moyen', value: 'medium' },
          { label: 'Grand', value: 'large' },
          { label: 'Original', value: 'original' }
        ];
        
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
            const originalWidth = parseInt(img.getAttribute('data-original-width') || '0');
            
            // Définir la taille en fonction de l'option sélectionnée
            switch (size) {
              case 'small':
                img.style.width = '25%';
                break;
              case 'medium':
                img.style.width = '50%';
                break;
              case 'large':
                img.style.width = '75%';
                break;
              case 'original':
                img.style.width = originalWidth ? `${originalWidth}px` : 'auto';
                break;
            }
            
            // Mettre à jour le contenu du formulaire
            handleEditorChange();
            
            // Supprimer le menu après la sélection
            menu.remove();
          });
          
          menu.appendChild(btn);
        });
        
        // Ajouter le menu à l'éditeur
        editorRef.current!.appendChild(menu);
        
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
      });
    });
  };
  
  // Initialiser l'éditeur de texte riche
  useEffect(() => {
    if (editorRef.current && !isLoading) {
      editorRef.current.contentEditable = 'true';
      editorRef.current.innerHTML = formData.content;
      
      // Rendre les images redimensionnables
      makeImagesResizable();
    }
  }, [isLoading, formData.content]);
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug) {
      toast.error('Slug manquant. Impossible de mettre à jour l\'article.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convertir les tags en tableau
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      // Créer l'objet de mise à jour
      const postUpdate: BlogPostUpdate = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        cover_image: formData.coverImage,
        category: formData.category,
        tags: tagsArray
      };
      
      // Envoyer la mise à jour au serveur
      await blogApi.updatePost(slug, postUpdate);
      
      toast.success('Article mis à jour avec succès !');
      setIsSubmitting(false);
      
      // Rediriger vers la page de l'article après un court délai
      setTimeout(() => {
        navigate(`/blog/${slug}`);
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      toast.error('Erreur lors de la mise à jour de l\'article. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader size={40} className="animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Modifier l'article</h1>
          
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
                    name="coverImage"
                    value={formData.coverImage}
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
                  {formData.coverImage && (
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
                        src={coverImagePreview || formData.coverImage}
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
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: javascript, react, web"
                  />
                </div>
                
                {/* Contenu */}
                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Contenu
                  </label>
                  
                  {/* Input caché pour le téléchargement d'image */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {/* Barre d'outils de l'éditeur */}
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 border border-gray-300 rounded-t-md">
                    <button
                      type="button"
                      onClick={openFileDialog}
                      className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 flex items-center"
                      title="Insérer une image"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader size={16} className="animate-spin mr-1" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Image size={16} className="mr-1" />
                          Image
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Éditeur de texte riche */}
                  <div
                    ref={editorRef}
                    className="w-full min-h-[300px] p-4 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onInput={handleEditorChange}
                    style={{ overflowY: 'auto' }}
                  />
                </div>
                
                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    variant="outline"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      'Mettre à jour l\'article'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditBlogPostPage;
