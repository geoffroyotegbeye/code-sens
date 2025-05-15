import React from 'react';
import { EditorProvider } from './EditorContext';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import ImageHandler from './ImageHandler';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  className = '',
  placeholder = 'Commencez à écrire ici...'
}) => {
  return (
    <EditorProvider 
      initialContent={content} 
      onContentChange={onChange} 
      placeholder={placeholder}
    >
      <div className={`rich-text-editor ${className}`}>
        <EditorToolbar />
        <EditorContent className={className} />
        <ImageHandler />
      </div>
    </EditorProvider>
  );
};

export default RichTextEditor;