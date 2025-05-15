/**
 * Utilitaire pour générer un sitemap XML pour améliorer le référencement
 */

import fs from 'fs';
import { format } from 'date-fns';

interface SitemapURL {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Génère un sitemap XML à partir d'une liste d'URLs
 * @param urls Liste des URLs à inclure dans le sitemap
 * @param baseUrl URL de base du site
 * @param outputPath Chemin où sauvegarder le fichier sitemap.xml
 */
export const generateSitemap = async (
  urls: SitemapURL[],
  baseUrl: string = 'https://www.code-sens.com',
  outputPath: string = './public/sitemap.xml'
): Promise<void> => {
  // Entête XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Ajouter chaque URL
  urls.forEach(({ url, lastModified, changeFrequency, priority }) => {
    sitemap += `  <url>
    <loc>${baseUrl}${url}</loc>
`;

    // Ajouter la date de dernière modification si disponible
    if (lastModified) {
      const formattedDate = format(lastModified, 'yyyy-MM-dd');
      sitemap += `    <lastmod>${formattedDate}</lastmod>
`;
    }

    // Ajouter la fréquence de changement si disponible
    if (changeFrequency) {
      sitemap += `    <changefreq>${changeFrequency}</changefreq>
`;
    }

    // Ajouter la priorité si disponible
    if (priority !== undefined) {
      sitemap += `    <priority>${priority.toFixed(1)}</priority>
`;
    }

    sitemap += `  </url>
`;
  });

  // Fermer le XML
  sitemap += `</urlset>`;

  // Écrire le fichier
  fs.writeFileSync(outputPath, sitemap);
  console.log(`Sitemap généré avec succès à ${outputPath}`);
};

/**
 * Fonction pour générer le sitemap à partir des articles de blog
 * @param blogPosts Liste des articles de blog
 * @param baseUrl URL de base du site
 */
export const generateBlogSitemap = async (
  blogPosts: any[],
  baseUrl: string = 'https://www.code-sens.com'
): Promise<void> => {
  // URLs statiques du site
  const staticUrls: SitemapURL[] = [
    { url: '/', changeFrequency: 'weekly', priority: 1.0 },
    { url: '/blog', changeFrequency: 'daily', priority: 0.9 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Ajouter les URLs des articles de blog
  const blogUrls: SitemapURL[] = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Combiner toutes les URLs
  const allUrls = [...staticUrls, ...blogUrls];

  // Générer le sitemap
  await generateSitemap(allUrls, baseUrl);
};

export default generateBlogSitemap;
