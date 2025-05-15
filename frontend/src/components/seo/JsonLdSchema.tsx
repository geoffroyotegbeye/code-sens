import React, { useEffect } from 'react';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  imageUrl?: string;
  url: string;
  siteName: string;
  keywords?: string[];
  category?: string;
}

/**
 * Composant pour générer les données structurées JSON-LD pour un article de blog
 * Cela améliore considérablement le référencement et l'affichage dans les résultats de recherche
 */
export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  imageUrl,
  url,
  siteName,
  keywords = [],
  category,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${url.split('/').slice(0, 3).join('/')}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: keywords.join(', '),
    articleSection: category,
  };

  useEffect(() => {
    // Rechercher un script LD+JSON existant pour les articles ou en créer un nouveau
    let script = document.querySelector('script[type="application/ld+json"][data-schema="blogpost"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'blogpost');
      document.head.appendChild(script);
    }
    
    // Mettre à jour le contenu du script
    script.textContent = JSON.stringify(schema);
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Optionnel: supprimer le script si nécessaire
    };
  }, [schema]);
  
  // Ce composant ne rend rien visuellement
  return null;
};

interface WebsiteSchemaProps {
  siteName: string;
  siteUrl: string;
  description: string;
  language?: string;
}

/**
 * Composant pour générer les données structurées JSON-LD pour le site web
 */
export const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
  siteName,
  siteUrl,
  description,
  language = 'fr-FR',
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: description,
    inLanguage: language,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  useEffect(() => {
    // Rechercher un script LD+JSON existant pour le site web ou en créer un nouveau
    let script = document.querySelector('script[type="application/ld+json"][data-schema="website"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'website');
      document.head.appendChild(script);
    }
    
    // Mettre à jour le contenu du script
    script.textContent = JSON.stringify(schema);
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Optionnel: supprimer le script si nécessaire
    };
  }, [schema]);
  
  // Ce composant ne rend rien visuellement
  return null;
};

export default { BlogPostSchema, WebsiteSchema };
