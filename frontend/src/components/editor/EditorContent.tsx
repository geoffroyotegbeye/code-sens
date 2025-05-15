import React, { useEffect } from 'react';
import { useEditorContext } from './EditorContext';
import { setupImageResizeHandlers } from './EditorUtils';

interface EditorContentProps {
  className?: string;
}

const EditorContent: React.FC<EditorContentProps> = ({ className = '' }) => {
  const {
    editorRef,
    content,
    handleEditorChange,
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
    isUploading,
    placeholder
  } = useEditorContext();

  // Gérer le redimensionnement des images
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('resize-handle')) {
        const img = target.parentElement?.querySelector('img') as HTMLImageElement;
        if (img) {
          setResizingImage(img);
          setStartX(e.clientX);
          setStartY(e.clientY);
          setStartWidth(img.clientWidth);
          setStartHeight(img.clientHeight);
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingImage) return;
      
      const width = startWidth + (e.clientX - startX);
      const height = startHeight + (e.clientY - startY);
      
      if (width > 50 && height > 50) {
        resizingImage.style.width = `${width}px`;
        resizingImage.style.height = `${height}px`;
      }
    };
    
    const handleMouseUp = () => {
      if (resizingImage) {
        setResizingImage(null);
        handleEditorChange();
      }
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    resizingImage, 
    setResizingImage, 
    startX, 
    startY, 
    startWidth, 
    startHeight,
    setStartX,
    setStartY,
    setStartWidth,
    setStartHeight,
    handleEditorChange
  ]);

  // Gérer le glisser-déposer des images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.classList.add('drag-over');
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editorRef.current) {
      editorRef.current.classList.remove('drag-over');
    }
  };

  // Initialiser le contenu de l'éditeur et configurer les gestionnaires d'événements
  useEffect(() => {
    if (editorRef.current) {
      // Initialiser le contenu uniquement lors du premier chargement
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>') {
        if (content) {
          editorRef.current.innerHTML = content;
        } else {
          editorRef.current.innerHTML = `<div class="text-gray-400">${placeholder}</div>`;
        }
      }
      
      // Configurer les gestionnaires d'événements pour le redimensionnement des images
      setupImageResizeHandlers(editorRef.current);
      
      // Ajouter les écouteurs d'événements pour le glisser-déposer
      if (editorRef.current) {
        editorRef.current.addEventListener('dragover', handleDragOver as unknown as EventListener);
        editorRef.current.addEventListener('dragleave', handleDragLeave as unknown as EventListener);
      }
      
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('dragover', handleDragOver as unknown as EventListener);
          editorRef.current.removeEventListener('dragleave', handleDragLeave as unknown as EventListener);
        }
      };
    }
  }, [content, placeholder]);

  return (
    <div className="relative">
      <div
        ref={editorRef}
        className={`w-full h-[700px] p-4 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto ${className}`}
        contentEditable
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
      />
      
      {/* Indicateur de chargement */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-blue-500 font-medium">Téléchargement en cours...</p>
          </div>
        </div>
      )}
      
      {/* Styles pour le glisser-déposer, redimensionnement et blocs de code */}
      <style>
        {`
        .drag-over {
          background-color: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }
        
        .resizable-image {
          position: relative;
          display: inline-block;
        }
        
        .resize-handle {
          position: absolute;
          right: -5px;
          bottom: -5px;
          width: 10px;
          height: 10px;
          background-color: #0066ff;
          cursor: nwse-resize;
          border-radius: 50%;
          z-index: 1000;
        }
        
        /* Styles pour les blocs de code copiables */
        .code-block-container {
          margin: 1rem 0;
          border-radius: 0.375rem;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }
        
        .code-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: #e2e8f0;
          border-bottom: 1px solid #cbd5e1;
        }
        
        .code-block-language {
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
        }
        
        .code-block-copy-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          color: #475569;
          background-color: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .code-block-copy-btn:hover {
          background-color: #e2e8f0;
        }
        
        .code-block-content {
          padding: 1rem;
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #334155;
          white-space: pre-wrap;
          overflow-x: auto;
        }
        
        /* Styles spécifiques selon le langage */
        .code-block-container[data-language="javascript"] .code-block-content,
        .code-block-container[data-language="typescript"] .code-block-content {
          background-color: #fffbeb;
        }
        
        .code-block-container[data-language="python"] .code-block-content {
          background-color: #ecfdf5;
        }
        
        .code-block-container[data-language="html"] .code-block-content,
        .code-block-container[data-language="css"] .code-block-content {
          background-color: #f0f9ff;
        }
        `}
      </style>
    </div>
  );
};

export default EditorContent;
