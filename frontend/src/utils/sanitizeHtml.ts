import DOMPurify from 'dompurify';
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param html HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeContent = (html: string): string => {
  // Configuration pour sanitize-html avec des options de sécurité renforcées
  const sanitizeOptions = {
    // Désactiver l'utilisation de balises personnalisées
    allowVulnerableTags: false,
    // Désactiver les commentaires HTML qui pourraient cacher du code malveillant
    allowComments: false,
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span',
      'u', 'del', 'sup', 'sub', 'button', 'svg', 'rect', 'path'
    ],
    allowedAttributes: {
      '*': ['class', 'style', 'id', 'data-language'],
      'a': ['href', 'name', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'class', 'style'],
      'span': ['style', 'class'],
      'button': ['type', 'class', 'onclick', 'data-target'],
      'svg': ['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
      'rect': ['x', 'y', 'width', 'height', 'rx', 'ry'],
      'path': ['d']
    },
    allowedStyles: {
      '*': {
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i, /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*\)$/i],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i, /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*\)$/i],
        'width': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'height': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'max-width': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'max-height': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'min-width': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'min-height': [/^auto$/, /^[0-9]+px$/, /^[0-9]+%$/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        'text-decoration': [/^none$/, /^underline$/, /^line-through$/],
        'display': [/^block$/, /^inline$/, /^inline-block$/],
        'margin': [/^auto$/, /^\d+(?:px|em|rem|%)$/],
        'padding': [/^\d+(?:px|em|rem|%)$/],
        'border': [/^(?:\d+(?:px|em|rem|%) )?(?:solid|dashed|dotted) #[0-9a-f]+$/i]
      }
    },
    // Transformer les URLs pour s'assurer qu'elles sont sécurisées
    transformTags: {
      'a': (tagName, attribs) => {
        // Vérifier si l'URL est sécurisée
        if (attribs.href) {
          // S'assurer que les liens externes s'ouvrent dans un nouvel onglet avec des attributs de sécurité
          if (attribs.href.startsWith('http')) {
            return {
              tagName,
              attribs: {
                ...attribs,
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            };
          }
        }
        return { tagName, attribs };
      },
      'img': (tagName, attribs) => {
        // Vérifier si l'URL de l'image est sécurisée
        if (attribs.src) {
          // Valider que l'URL est une URL d'image valide
          const isValidImageUrl = /^(https?:\/\/|\/static\/uploads\/|data:image\/)/.test(attribs.src);
          
          if (!isValidImageUrl) {
            // Si l'URL n'est pas valide, remplacer par une image par défaut
            return {
              tagName,
              attribs: {
                ...attribs,
                src: 'https://via.placeholder.com/300x200?text=Image+non+disponible',
                alt: 'Image non disponible'
              }
            };
          }
        }
        return { tagName, attribs };
      }
    }
  };

  // Double sanitization pour une sécurité maximale
  let sanitized = sanitizeHtml(html, sanitizeOptions);
  
  // Utiliser DOMPurify comme couche supplémentaire de sécurité avec des options renforcées
  const purifyOptions = {
    FORBID_ATTR: ['onerror', 'onload', 'onunload', 'onabort', 'onblur', 'onchange', 'onclick', 'ondblclick', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onselect', 'onsubmit'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'option'],
    ADD_URI_SAFE_ATTR: ['data-target', 'data-language'],
    ALLOW_DATA_ATTR: false,  // Désactiver les attributs data-* par défaut sauf ceux explicitement autorisés
    USE_PROFILES: { html: true }, // Utiliser le profil HTML standard
  };
  
  return DOMPurify.sanitize(sanitized, purifyOptions);
};

/**
 * Valider une URL pour s'assurer qu'elle est sécurisée
 * 
 * @param url URL à valider
 * @returns URL validée ou null si non valide
 */
export const validateUrl = (url: string): string | null => {
  try {
    // Vérifier si l'URL est relative
    if (url.startsWith('/')) {
      return url;
    }
    
    // Vérifier si l'URL est un data URI pour les images
    if (url.startsWith('data:image/')) {
      return url;
    }
    
    // Pour les URLs absolues, vérifier qu'elles utilisent http ou https
    const parsedUrl = new URL(url);
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return url;
    }
    
    return null;
  } catch (error) {
    console.error('URL invalide:', error);
    return null;
  }
};
