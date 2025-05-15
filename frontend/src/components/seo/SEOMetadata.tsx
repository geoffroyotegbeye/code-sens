import React, { useEffect } from 'react';

interface SEOMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Composant pour gérer les métadonnées SEO des pages
 * À utiliser sur chaque page pour améliorer le référencement
 */
const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonicalUrl,
  twitterCard = 'summary_large_image',
  author = 'Code & Sens',
  publishedTime,
  modifiedTime,
}) => {
  // URL de base du site
  const siteUrl = window.location.origin || 'https://www.code-sens.com';
  
  // URL canonique complète
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  
  // Image pour les réseaux sociaux
  const socialImage = ogImage || `${siteUrl}/images/default-og-image.jpg`;
  
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = title;
    
    // Fonction pour créer ou mettre à jour une balise meta
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Fonction pour créer ou mettre à jour une balise link
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };
    
    // Métadonnées de base
    updateMetaTag('description', description);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }
    
    // URL canonique
    if (fullCanonicalUrl) {
      updateLinkTag('canonical', fullCanonicalUrl);
    }
    
    // Métadonnées Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    if (fullCanonicalUrl) {
      updateMetaTag('og:url', fullCanonicalUrl, true);
    }
    updateMetaTag('og:image', socialImage, true);
    updateMetaTag('og:site_name', 'Code & Sens', true);
    
    // Métadonnées Twitter
    updateMetaTag('twitter:card', twitterCard, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', socialImage, true);
    
    // Métadonnées pour les articles de blog
    if (ogType === 'article') {
      updateMetaTag('article:author', author, true);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
    }
    
    // Métadonnées pour les robots
    updateMetaTag('robots', 'index, follow');
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Optionnel: réinitialiser les métadonnées si nécessaire
    };
  }, [title, description, keywords, fullCanonicalUrl, ogType, socialImage, twitterCard, author, publishedTime, modifiedTime]);
  
  // Ce composant ne rend rien visuellement
  return null;
};

export default SEOMetadata;
