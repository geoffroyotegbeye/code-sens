import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, X, Loader } from 'lucide-react';
import { uploadApi } from '../../services/uploadApi';
import toast from 'react-hot-toast';

interface ImageDropzoneProps {
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageUploaded, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDropzone, setShowDropzone] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Fonction pour mettre à jour la progression
      const updateProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      // Télécharger l'image et obtenir l'URL du serveur
      const imageUrl = await uploadApi.uploadImage(file, updateProgress);
      
      // Appeler le callback avec l'URL de l'image
      onImageUploaded(imageUrl);
      
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowDropzone(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    disabled: isUploading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0]);
      }
    }
  });

  if (!showDropzone && !isUploading) {
    return (
      <button
        type="button"
        onClick={() => setShowDropzone(true)}
        className={`p-2 hover:bg-gray-200 rounded flex items-center ${className}`}
        title="Glisser-déposer une image"
      >
        <Image size={16} className="mr-1" />
        <span className="text-sm">Image</span>
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isUploading && (
        <button
          type="button"
          onClick={() => setShowDropzone(false)}
          className="absolute top-1 right-1 z-10 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
          title="Fermer"
        >
          <X size={14} />
        </button>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
        } rounded-md p-4 flex flex-col items-center justify-center transition-colors ${
          isUploading ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{ minHeight: '120px', minWidth: '200px' }}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="w-full">
            <div className="flex items-center justify-center mb-2">
              <Loader size={24} className="animate-spin text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Téléchargement en cours... {uploadProgress}%
            </p>
          </div>
        ) : isDragActive ? (
          <div className="text-center">
            <Image size={32} className="mx-auto mb-2 text-blue-500" />
            <p className="text-blue-500">Déposez l'image ici...</p>
          </div>
        ) : (
          <div className="text-center">
            <Image size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 mb-1">
              Glissez-déposez une image ici, ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG, GIF, WEBP (max. 5 MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
