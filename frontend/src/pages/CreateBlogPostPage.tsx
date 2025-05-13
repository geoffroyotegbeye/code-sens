import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { blogApi } from '../services/blogApi';
import { uploadApi } from '../services/uploadApi';
import { BlogPostCreate } from '../types/blog';
import toast from 'react-hot-toast';
import { Image, Loader } from 'lucide-react';

const CreateBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  // Rediriger si l'utilisateur n'est pas administrateur
  const checkAdminStatus = () => {
    if (!isAdmin) {
      toast.error('Vous n\'avez pas les droits pour créer un article');
      navigate('/blog');
    }
  };
  
  // Vérifier les droits d'administration au chargement de la page
  React.useEffect(() => {
    checkAdminStatus();
  }, [isAdmin, navigate]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Initialiser l'éditeur de texte riche
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = 'true';
      editorRef.current.innerHTML = formData.content;
      
      // Rendre les images redimensionnables
      makeImagesResizable();
    }
  }, []);
  
  // Fonction pour rendre les images redimensionnables
  const makeImagesResizable = () => {
    if (!editorRef.current) return;
    
    // Sélectionner toutes les images dans l'éditeur
    const images = editorRef.current.querySelectorAll('img.resizable-image');
    
    images.forEach((img) => {
      // Vérifier si l'image a déjà été rendue redimensionnable
      if (img.getAttribute('data-resizable') === 'true') return;
      
      // Marquer l'image comme redimensionnable
      img.setAttribute('data-resizable', 'true');
      
      // Ajouter des gestionnaires d'événements pour le redimensionnement
      img.addEventListener('click', (e) => {
        // Sélectionner l'image actuelle
        const currentImg = e.target as HTMLImageElement;
        
        // Ajouter la classe sélectionnée et les poignées de redimensionnement
        currentImg.classList.add('selected-image');
        currentImg.style.border = '2px dashed #3182ce';
        currentImg.style.padding = '4px';
        
        // Créer un menu de redimensionnement
        const resizeMenu = document.createElement('div');
        resizeMenu.className = 'resize-menu';
        resizeMenu.style.position = 'absolute';
        resizeMenu.style.top = `${currentImg.offsetTop + currentImg.offsetHeight + 5}px`;
        resizeMenu.style.left = `${currentImg.offsetLeft}px`;
        resizeMenu.style.backgroundColor = '#f8f9fa';
        resizeMenu.style.border = '1px solid #ddd';
        resizeMenu.style.borderRadius = '4px';
        resizeMenu.style.padding = '8px';
        resizeMenu.style.zIndex = '1000';
        
        // Ajouter les options de taille
        resizeMenu.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 12px;">Taille:</label>
            <button class="size-btn" data-size="small" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;">Petite</button>
            <button class="size-btn" data-size="medium" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;">Moyenne</button>
            <button class="size-btn" data-size="large" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;">Grande</button>
            <button class="size-btn" data-size="original" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px;">Originale</button>
          </div>
        `;
        
        // Ajouter le menu à l'éditeur
        editorRef.current?.appendChild(resizeMenu);
        
        // Ajouter les gestionnaires d'événements pour les boutons de taille
        const sizeButtons = resizeMenu.querySelectorAll('.size-btn');
        sizeButtons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-size');
            const originalWidth = parseInt(currentImg.getAttribute('data-original-width') || '0');
            
            // Définir la taille en fonction de l'option sélectionnée
            switch (size) {
              case 'small':
                currentImg.style.width = `${originalWidth * 0.3}px`;
                break;
              case 'medium':
                currentImg.style.width = `${originalWidth * 0.5}px`;
                break;
              case 'large':
                currentImg.style.width = `${originalWidth * 0.8}px`;
                break;
              case 'original':
                currentImg.style.width = `${originalWidth}px`;
                break;
            }
            
            // Mettre à jour le contenu de l'éditeur
            handleEditorChange();
            
            // Supprimer le menu de redimensionnement
            resizeMenu.remove();
            
            // Supprimer la sélection
            currentImg.classList.remove('selected-image');
            currentImg.style.border = '';
            currentImg.style.padding = '';
          });
        });
        
        // Fermer le menu lorsqu'on clique ailleurs
        const closeMenu = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (!resizeMenu.contains(target) && target !== currentImg) {
            resizeMenu.remove();
            currentImg.classList.remove('selected-image');
            currentImg.style.border = '';
            currentImg.style.padding = '';
            document.removeEventListener('click', closeMenu);
          }
        };
        
        // Ajouter un délai pour éviter que le menu ne se ferme immédiatement
        setTimeout(() => {
          document.addEventListener('click', closeMenu);
        }, 100);
      });
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Mettre à jour le contenu de l'éditeur
  const handleEditorChange = () => {
    if (editorRef.current) {
      setFormData(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || ''
      }));
    }
  };
  
  // Fonctions pour le formatage du texte
  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleEditorChange();
  };

  // Gérer le téléchargement d'images depuis l'ordinateur local
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      console.log('Début du téléchargement de l\'image:', file.name);
      
      const imageUrl = await uploadApi.uploadImage(file);
      console.log('URL de l\'image reçue du serveur:', imageUrl);
      
      // Vérifier si l'URL est valide
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('URL d\'image invalide reçue du serveur');
      }
      
      // Construire l'URL complète si nécessaire
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/')) {
        // Si c'est une URL relative, ajouter le domaine du backend
        fullImageUrl = `http://localhost:8000${imageUrl}`;
      }
      
      console.log('URL complète de l\'image:', fullImageUrl);
      
      // Créer un élément image pour tester si l'URL est accessible
      const testImage = document.createElement('img');
      testImage.onload = () => {
        console.log('Image chargée avec succès');
        
        // Insérer l'image dans l'éditeur avec une taille maximale et des attributs pour le redimensionnement
        const imgHtml = `<img src="${fullImageUrl}" alt="Image téléchargée" style="max-width: 100%; height: auto;" class="resizable-image" data-original-width="${testImage.naturalWidth}" data-original-height="${testImage.naturalHeight}" />`;
        
        // Insérer directement le HTML dans l'éditeur
        if (editorRef.current) {
          document.execCommand('insertHTML', false, imgHtml);
          handleEditorChange(); // Mettre à jour le contenu
          
          // Ajouter les gestionnaires d'événements pour le redimensionnement des images
          setTimeout(() => {
            makeImagesResizable();
          }, 100);
          
          toast.success('Image téléchargée avec succès');
        }
      };
      
      testImage.onerror = () => {
        console.error('Impossible de charger l\'image depuis l\'URL:', fullImageUrl);
        toast.error('L\'image a été téléchargée mais ne peut pas être affichée');
        setIsUploading(false);
      };
      
      // Démarrer le chargement de l'image de test
      testImage.src = fullImageUrl;
      
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      setIsUploading(false);
    }
  };
  
  // Ouvrir la boîte de dialogue de sélection de fichier pour l'éditeur
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Ouvrir la boîte de dialogue de sélection de fichier pour l'image de couverture
  const openCoverImageDialog = () => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.click();
    }
  };
  
  // Gérer le changement de fichier sélectionné pour l'éditeur
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  
  // Gérer le changement de fichier sélectionné pour l'image de couverture
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleCoverImageUpload(file);
    }
  };
  
  // Gérer le téléchargement de l'image de couverture
  const handleCoverImageUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setIsCoverImageUploading(true);
      console.log('Début du téléchargement de l\'image de couverture:', file.name);
      
      // Créer une URL temporaire pour l'aperçu
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
      
      // Télécharger l'image
      const imageUrl = await uploadApi.uploadImage(file);
      console.log('URL de l\'image de couverture reçue du serveur:', imageUrl);
      
      // Vérifier si l'URL est valide
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('URL d\'image invalide reçue du serveur');
      }
      
      // Construire l'URL complète si nécessaire
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith('/')) {
        // Si c'est une URL relative, ajouter le domaine du backend
        fullImageUrl = `http://localhost:8000${imageUrl}`;
      }
      
      // Mettre à jour le champ coverImage
      setFormData(prev => ({
        ...prev,
        coverImage: fullImageUrl
      }));
      
      toast.success('Image de couverture téléchargée avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image de couverture:', error);
      toast.error('Erreur lors du téléchargement de l\'image de couverture');
      setCoverImagePreview(null);
    } finally {
      setIsCoverImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Prepare tags array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      if (!user || !user.id) {
        toast.error('Vous devez être connecté pour créer un article');
        return;
      }

      const newPost: BlogPostCreate = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.coverImage,
        category: formData.category,
        tags,
        author_id: user.id
      };

      console.log('Envoi de l\'article au backend:', newPost);
      
      // Appel réel à l'API
      await blogApi.createPost(newPost);
      toast.success('Article publié avec succès');
      navigate('/blog');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      toast.error('Impossible de publier l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Title */}
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
                  placeholder="Le titre de votre article"
                />
              </div>

              {/* Excerpt */}
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
                  placeholder="Un bref résumé de votre article"
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                
                {/* Barre d'outils de l'éditeur */}
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-t-md border border-gray-300">
                  <button 
                    type="button" 
                    onClick={() => formatText('bold')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Gras"
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('italic')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Italique"
                  >
                    <span className="italic">I</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('underline')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Souligné"
                  >
                    <span className="underline">U</span>
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-1"></div>
                  <button 
                    type="button" 
                    onClick={() => formatText('formatBlock', '<h1>')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Titre 1"
                  >
                    <span className="font-bold text-lg">H1</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('formatBlock', '<h2>')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Titre 2"
                  >
                    <span className="font-bold">H2</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('formatBlock', '<h3>')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Titre 3"
                  >
                    <span className="font-bold text-sm">H3</span>
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-1"></div>
                  <button 
                    type="button" 
                    onClick={() => formatText('insertUnorderedList')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Liste à puces"
                  >
                    • Liste
                  </button>
                  <button 
                    type="button" 
                    onClick={() => formatText('insertOrderedList')}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Liste numérotée"
                  >
                    1. Liste
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-1"></div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const url = prompt('Entrez l\'URL du lien:');
                      if (url) formatText('createLink', url);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Insérer un lien"
                  >
                    Lien
                  </button>
                  {/* Input de fichier caché pour le téléchargement d'images */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {/* Bouton pour insérer une image depuis une URL */}
                  <button 
                    type="button" 
                    onClick={() => {
                      const url = prompt('Entrez l\'URL de l\'image:');
                      if (url) formatText('insertImage', url);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Insérer une image depuis une URL"
                  >
                    URL Image
                  </button>
                  
                  {/* Bouton pour télécharger une image depuis l'ordinateur */}
                  <button 
                    type="button" 
                    onClick={openFileDialog}
                    className="p-1 hover:bg-gray-200 rounded flex items-center"
                    title="Télécharger une image depuis l'ordinateur"
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
                        Image locale
                      </>
                    )}
                  </button>
                </div>
                
                {/* Éditeur de texte riche */}
                <div
                  ref={editorRef}
                  onInput={handleEditorChange}
                  className="w-full min-h-[300px] p-4 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 overflow-auto"
                  style={{ backgroundColor: 'white' }}
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

              {/* Category */}
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
                  <option value="Web Development">Développement Web</option>
                  <option value="Mobile Development">Développement Mobile</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Design">Design</option>
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
                  placeholder="React, JavaScript, Tutorial"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/blog')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="text-white"
                >
                  Publier l'article
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateBlogPostPage;