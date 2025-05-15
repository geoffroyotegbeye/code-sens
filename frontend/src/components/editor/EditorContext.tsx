import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { sanitizeContent } from '../../utils/sanitizeHtml';

interface EditorContextProps {
  content: string;
  onChange: (content: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  resizingImage: HTMLImageElement | null;
  setResizingImage: (img: HTMLImageElement | null) => void;
  startX: number;
  setStartX: (x: number) => void;
  startY: number;
  setStartY: (y: number) => void;
  startWidth: number;
  setStartWidth: (width: number) => void;
  startHeight: number;
  setStartHeight: (height: number) => void;
  history: string[];
  setHistory: (history: string[]) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  isUndoRedo: boolean;
  setIsUndoRedo: (value: boolean) => void;
  showTextColorMenu: boolean;
  setShowTextColorMenu: (show: boolean) => void;
  showBgColorMenu: boolean;
  setShowBgColorMenu: (show: boolean) => void;
  textColorMenuRef: React.RefObject<HTMLDivElement>;
  bgColorMenuRef: React.RefObject<HTMLDivElement>;
  showImageDropzone: boolean;
  setShowImageDropzone: (show: boolean) => void;
  handleEditorChange: () => void;
  placeholder: string;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
  initialContent: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialContent,
  onContentChange,
  placeholder = 'Commencez à écrire ici...'
}) => {
  // Références
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textColorMenuRef = useRef<HTMLDivElement>(null);
  const bgColorMenuRef = useRef<HTMLDivElement>(null);
  
  // États
  const [content, setContent] = useState(initialContent);
  const [isUploading, setIsUploading] = useState(false);
  const [resizingImage, setResizingImage] = useState<HTMLImageElement | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  
  // Historique pour undo/redo
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  
  // États pour les menus
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showBgColorMenu, setShowBgColorMenu] = useState(false);
  const [showImageDropzone, setShowImageDropzone] = useState(false);
  
  // Mettre à jour le contenu lorsque l'éditeur change
  const handleEditorChange = () => {
    if (!editorRef.current) return;
    
    // Supprimer le placeholder si l'utilisateur commence à taper
    if (editorRef.current.innerHTML.includes(`<div class="text-gray-400">${placeholder}</div>`)) {
      editorRef.current.innerHTML = '';
    }
    
    // Sanitize le contenu pour éviter les injections XSS
    const rawContent = editorRef.current.innerHTML;
    const sanitizedContent = sanitizeContent(rawContent);
    
    // Ne pas mettre à jour l'historique pendant undo/redo
    if (!isUndoRedo) {
      // Ajouter le nouveau contenu à l'historique
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(sanitizedContent);
      
      // Limiter la taille de l'historique
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setContent(sanitizedContent);
    onContentChange(sanitizedContent);
  };
  
  const value = {
    content,
    onChange: onContentChange,
    editorRef,
    fileInputRef,
    isUploading,
    setIsUploading,
    resizingImage,
    setResizingImage,
    startX,
    setStartX,
    startY,
    setStartY,
    startWidth,
    setStartWidth,
    startHeight,
    setStartHeight,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    isUndoRedo,
    setIsUndoRedo,
    showTextColorMenu,
    setShowTextColorMenu,
    showBgColorMenu,
    setShowBgColorMenu,
    textColorMenuRef,
    bgColorMenuRef,
    showImageDropzone,
    setShowImageDropzone,
    handleEditorChange,
    placeholder
  };
  
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
