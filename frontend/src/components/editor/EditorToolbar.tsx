import React from 'react';
import {
  Bold, Italic, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight,
  Quote, Code, Underline, Strikethrough, Type, Table, Undo, Redo, Palette,
  Trash2, PaintBucket, Youtube, FileImage, Terminal
} from 'lucide-react';
import { execCommand, createTable, createCodeBlock } from './EditorUtils';
import { useEditorContext } from './EditorContext';
import ColorPicker from './ColorPicker';
import ImageDropzone from './ImageDropzone';

// Sous-composant pour un groupe de boutons dans la barre d'outils
interface ToolbarGroupProps {
  children: React.ReactNode;
  className?: string;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children, className = '' }) => (
  <div className={`flex gap-1 mr-2 border-r pr-2 border-gray-300 ${className}`}>
    {children}
  </div>
);

// Sous-composant pour un bouton de la barre d'outils
interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  title, 
  disabled = false, 
  children 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 hover:bg-gray-200 rounded flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={title}
    disabled={disabled}
  >
    {children}
  </button>
);

// Composant principal pour la barre d'outils
const EditorToolbar: React.FC = () => {
  const {
    editorRef,
    historyIndex,
    history,
    setHistoryIndex,
    setIsUndoRedo,
    showTextColorMenu,
    setShowTextColorMenu,
    showBgColorMenu,
    setShowBgColorMenu,
    textColorMenuRef,
    bgColorMenuRef,
    showImageDropzone,
    setShowImageDropzone
  } = useEditorContext();

  // Fonction pour annuler la dernière modification
  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      if (editorRef.current && history[newIndex]) {
        editorRef.current.innerHTML = history[newIndex];
      }
      
      setTimeout(() => setIsUndoRedo(false), 0);
    }
  };
  
  // Fonction pour rétablir une modification annulée
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      if (editorRef.current && history[newIndex]) {
        editorRef.current.innerHTML = history[newIndex];
      }
      
      setTimeout(() => setIsUndoRedo(false), 0);
    }
  };

  // Appliquer une couleur au texte sélectionné
  const applyTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowTextColorMenu(false);
  };
  
  // Appliquer une couleur d'arrière-plan au texte sélectionné
  const applyBgColor = (color: string) => {
    execCommand('hiliteColor', color);
    setShowBgColorMenu(false);
  };
  
  // Supprimer la couleur d'arrière-plan du texte sélectionné
  const removeBgColor = () => {
    execCommand('hiliteColor', 'transparent');
  };

  // Insérer un lien
  const insertLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Insérer une vidéo YouTube
  const insertYouTubeVideo = () => {
    const url = prompt('Entrez l\'URL de la vidéo YouTube:');
    if (!url) return;
    
    try {
      // Extraire l'ID de la vidéo YouTube
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (!videoId) {
        alert('URL YouTube invalide');
        return;
      }
      
      // Créer l'iframe pour la vidéo YouTube
      const embedHtml = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 15px 0;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
          src="https://www.youtube.com/embed/${videoId}" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>`;
      
      execCommand('insertHTML', embedHtml);
    } catch (error) {
      console.error('Erreur lors de l\'insertion de la vidéo YouTube:', error);
      alert('Impossible d\'insérer la vidéo YouTube');
    }
  };

  return (
    <div className="flex flex-wrap items-center p-2 bg-gray-100 border border-gray-300 rounded-t-md">
      {/* Groupe 1: Formatage de texte */}
      <ToolbarGroup>
        <ToolbarButton onClick={() => execCommand('bold')} title="Gras">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italique">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Souligné">
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Barré">
          <Strikethrough size={16} />
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 2: Listes */}
      <ToolbarGroup>
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Liste à puces">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Liste numérotée">
          <ListOrdered size={16} />
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 3: Formatage avancé */}
      <ToolbarGroup>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<h2>')} title="Titre">
          <Type size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<blockquote>')} title="Citation">
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<pre>')} title="Code inline">
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => {
            const language = prompt('Langage de programmation (optionnel):', 'javascript');
            execCommand('insertHTML', createCodeBlock(language || ''));
          }} 
          title="Bloc de code copiable"
        >
          <Terminal size={16} />
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 4: Alignement */}
      <ToolbarGroup>
        <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Aligner à gauche">
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Centrer">
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyRight')} title="Aligner à droite">
          <AlignRight size={16} />
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 5: Couleurs */}
      <ToolbarGroup>
        <div className="relative">
          <ToolbarButton 
            onClick={() => setShowTextColorMenu(!showTextColorMenu)} 
            title="Couleur du texte"
          >
            <Palette size={16} />
          </ToolbarButton>
          {showTextColorMenu && (
            <div ref={textColorMenuRef} className="absolute z-50 mt-1 left-0">
              <ColorPicker
                color="#000000"
                onChange={applyTextColor}
                onClose={() => setShowTextColorMenu(false)}
              />
            </div>
          )}
        </div>
        
        <div className="relative">
          <ToolbarButton 
            onClick={() => setShowBgColorMenu(!showBgColorMenu)} 
            title="Couleur d'arrière-plan"
          >
            <PaintBucket size={16} />
          </ToolbarButton>
          {showBgColorMenu && (
            <div ref={bgColorMenuRef} className="absolute z-50 mt-1 left-0">
              <ColorPicker
                color="#FFFF00"
                onChange={applyBgColor}
                onClose={() => setShowBgColorMenu(false)}
              />
            </div>
          )}
        </div>
        
        <ToolbarButton onClick={removeBgColor} title="Supprimer la couleur d'arrière-plan">
          <Trash2 size={16} />
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 6: Insérer des éléments */}
      <ToolbarGroup>
        <ToolbarButton onClick={insertLink} title="Insérer un lien">
          <Link size={16} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => {
            const rows = prompt('Nombre de lignes:', '2');
            const cols = prompt('Nombre de colonnes:', '2');
            if (rows && cols) {
              execCommand('insertHTML', createTable(parseInt(rows), parseInt(cols)));
            }
          }} 
          title="Insérer un tableau"
        >
          <Table size={16} />
        </ToolbarButton>
        
        <div className="relative">
          {showImageDropzone ? (
            <ImageDropzone
              onImageUploaded={(imageUrl) => {
                // Insérer l'image à la position du curseur
                const img = `<img src="${imageUrl}" alt="Image téléchargée" class="resizable-image" style="max-width: 100%;" />`;
                execCommand('insertHTML', img);
                setShowImageDropzone(false);
              }}
              className="absolute z-10 top-full left-0 mt-1"
            />
          ) : (
            <ToolbarButton 
              onClick={() => setShowImageDropzone(true)} 
              title="Glisser-déposer une image"
            >
              <FileImage size={16} className="mr-1" />
              <span className="text-xs">Image</span>
            </ToolbarButton>
          )}
        </div>
        
        <ToolbarButton onClick={insertYouTubeVideo} title="Insérer une vidéo YouTube">
          <Youtube size={16} className="mr-1" />
          <span className="text-xs">YouTube</span>
        </ToolbarButton>
      </ToolbarGroup>
      
      {/* Groupe 7: Annuler/Rétablir */}
      <div className="flex gap-1">
        <ToolbarButton 
          onClick={handleUndo} 
          title="Annuler" 
          disabled={historyIndex <= 0}
        >
          <Undo size={16} className={historyIndex <= 0 ? 'text-gray-400' : ''} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={handleRedo} 
          title="Rétablir" 
          disabled={historyIndex >= history.length - 1}
        >
          <Redo size={16} className={historyIndex >= history.length - 1 ? 'text-gray-400' : ''} />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default EditorToolbar;
