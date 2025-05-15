import { validateUrl } from '../../utils/sanitizeHtml';

/**
 * Exécuter une commande d'édition avec validation
 */
export const execCommand = (command: string, value: string = ''): boolean => {
  // Valider les URLs pour les commandes qui les utilisent
  if (command === 'createLink') {
    const validatedUrl = validateUrl(value);
    if (!validatedUrl) {
      console.error('URL invalide:', value);
      return false;
    }
    value = validatedUrl;
  }

  try {
    return document.execCommand(command, false, value);
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande ${command}:`, error);
    return false;
  }
};

/**
 * Créer un tableau HTML
 */
export const createTable = (rows: number, cols: number): string => {
  let table = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
  
  // Créer les lignes et colonnes
  for (let i = 0; i < rows; i++) {
    table += '<tr>';
    for (let j = 0; j < cols; j++) {
      table += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 50px;">&nbsp;</td>';
    }
    table += '</tr>';
  }
  
  table += '</table>';
  return table;
};

/**
 * Configurer les gestionnaires d'événements pour les images redimensionnables
 */
export const setupImageResizeHandlers = (
  editorRef: React.RefObject<HTMLDivElement>,
  setResizingImage: (img: HTMLImageElement | null) => void,
  setStartX: (x: number) => void,
  setStartY: (y: number) => void,
  setStartWidth: (width: number) => void,
  setStartHeight: (height: number) => void,
  handleMouseMove: (e: MouseEvent) => void,
  handleMouseUp: () => void
): void => {
  if (!editorRef.current) return;
  
  const images = editorRef.current.querySelectorAll('img') || [];
  
  images.forEach(img => {
    // Vérifier si l'image a déjà des gestionnaires
    if (img.classList.contains('resize-handlers-added')) return;
    
    // Marquer l'image comme ayant des gestionnaires
    img.classList.add('resize-handlers-added');
    
    // Ajouter une classe pour le redimensionnement
    img.classList.add('resizable-image');
    img.style.position = 'relative';
    
    // Créer des poignées de redimensionnement
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.style.position = 'absolute';
    handle.style.right = '-5px';
    handle.style.bottom = '-5px';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.background = '#0066ff';
    handle.style.cursor = 'nwse-resize';
    handle.style.borderRadius = '50%';
    handle.style.zIndex = '1000';
    
    // Ajouter les gestionnaires d'événements pour le redimensionnement
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      setResizingImage(img);
      setStartX(e.clientX);
      setStartY(e.clientY);
      setStartWidth(img.clientWidth);
      setStartHeight(img.clientHeight);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    img.parentNode?.insertBefore(handle, img.nextSibling);
  });
};

/**
 * Créer un bloc de code copiable
 */
export const createCodeBlock = (language: string = '', placeholder: string = 'Insérez votre code ici...'): string => {
  const uniqueId = `code-block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Ajouter le script global une seule fois au chargement de la page
  if (typeof window !== 'undefined' && typeof (window as any).codeBlockScriptAdded === 'undefined') {
    (window as any).codeBlockScriptAdded = true;
    
    // Fonction pour copier le code
    (window as any).copyCodeBlock = function(id: string) {
      const codeBlock = document.getElementById(id);
      if (!codeBlock) return;
      
      const codeContent = codeBlock.querySelector('.code-block-content');
      if (!codeContent) return;
      
      const code = codeContent.textContent || '';
      
      // Copier le code dans le presse-papier
      navigator.clipboard.writeText(code).then(() => {
        // Changer temporairement le texte du bouton
        const copyBtn = codeBlock.querySelector('.code-block-copy-btn span');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copié !';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    };
    
    // Ajouter un gestionnaire d'événements global pour les boutons de copie
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const copyButton = target.closest('.code-block-copy-btn');
      
      if (copyButton) {
        const codeBlockId = copyButton.getAttribute('data-target');
        if (codeBlockId) {
          e.preventDefault();
          (window as any).copyCodeBlock(codeBlockId);
        }
      }
    });
  }
  
  // Créer le HTML du bloc de code sans script inline (pour éviter les problèmes de sanitization)
  return `
    <div class="code-block-container" data-language="${language}" id="${uniqueId}">
      <div class="code-block-header">
        <span class="code-block-language">${language || 'Code'}</span>
        <button class="code-block-copy-btn" data-target="${uniqueId}" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copier</span>
        </button>
      </div>
      <pre class="code-block-content" contenteditable="true">${placeholder}</pre>
    </div>
  `;
};

/**
 * Couleurs prédéfinies pour l'éditeur
 */
export const editorColors = [
  { name: 'Noir', value: '#000000' },
  { name: 'Gris', value: '#666666' },
  { name: 'Rouge', value: '#FF0000' },
  { name: 'Bleu', value: '#0000FF' },
  { name: 'Vert', value: '#008000' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Violet', value: '#800080' },
  { name: 'Rose', value: '#FFC0CB' },
  { name: 'Jaune', value: '#FFFF00' },
  { name: 'Cyan', value: '#00FFFF' },
];
