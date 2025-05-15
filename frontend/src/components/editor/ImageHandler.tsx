import React, { useRef } from 'react';
import { useEditorContext } from './EditorContext';
import { uploadApi } from '../../services/uploadApi';
import toast from 'react-hot-toast';
import { execCommand } from './EditorUtils';

interface ImageHandlerProps {
  className?: string;
}

const ImageHandler: React.FC<ImageHandlerProps> = ({ className = '' }) => {
  const {
    fileInputRef,
    editorRef,
    setIsUploading,
    handleEditorChange
  } = useEditorContext();

  // Gérer le glisser-déposer des images
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editorRef.current) {
      editorRef.current.classList.remove('drag-over');
    }
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    // Vérifier que ce sont des images
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Veuillez déposer uniquement des images');
      return;
    }
    
    // Télécharger les images
    await uploadImages(imageFiles);
  };

  // Gérer la sélection de fichiers via l'input file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convertir FileList en Array
    const fileArray = Array.from(files);
    
    // Télécharger les images
    await uploadImages(fileArray);
    
    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fonction pour télécharger les images
  const uploadImages = async (files: File[]) => {
    try {
      setIsUploading(true);
      
      // Télécharger chaque image
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await uploadApi.uploadImage(formData);
        
        if (response.url) {
          // Créer l'élément image avec poignée de redimensionnement
          const img = `
            <span class="resizable-image" contenteditable="false">
              <img src="${response.url}" alt="${file.name}" style="max-width: 100%;" />
              <span class="resize-handle"></span>
            </span>
          `;
          
          // Insérer l'image à la position du curseur
          execCommand('insertHTML', img);
        }
      }
      
      // Mettre à jour le contenu de l'éditeur
      handleEditorChange();
      
      toast.success('Image(s) téléchargée(s) avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement des images:', error);
      toast.error('Erreur lors du téléchargement des images');
    } finally {
      setIsUploading(false);
    }
  };

  // Ouvrir la boîte de dialogue de sélection de fichier
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      {/* Input caché pour la sélection de fichiers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      {/* Zone de dépôt pour les images */}
      <div
        onDrop={handleDrop}
        className="hidden"
      />
    </div>
  );
};

export default ImageHandler;
