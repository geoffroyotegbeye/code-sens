import { Course, User, MentoringRequest, Category, BlogPost } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@exemple.com',
    password: 'password',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'Student User',
    email: 'user@exemple.com',
    password: 'password',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export const categories: Category[] = [
  { id: '1', name: 'Web Development', count: 4 },
  { id: '2', name: 'Mobile Development', count: 2 },
  { id: '3', name: 'Data Science', count: 3 },
  { id: '4', name: 'DevOps', count: 1 },
  { id: '5', name: 'Design', count: 2 },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Les meilleures pratiques pour le développement React en 2024',
    slug: 'meilleures-pratiques-react-2024',
    excerpt: 'Découvrez les dernières tendances et meilleures pratiques pour développer des applications React modernes et performantes.',
    content: `
# Les meilleures pratiques pour le développement React en 2024

Le développement React continue d'évoluer rapidement, avec de nouvelles fonctionnalités et pratiques qui émergent régulièrement. Dans cet article, nous allons explorer les meilleures pratiques actuelles pour développer des applications React modernes et performantes.

## 1. Utiliser les Hooks de manière efficace

Les Hooks sont devenus la norme pour la gestion d'état et des effets secondaires dans React. Voici quelques bonnes pratiques :

- Préférer \`useState\` pour l'état local simple
- Utiliser \`useReducer\` pour les états complexes
- Créer des hooks personnalisés pour la logique réutilisable

## 2. Optimiser les performances

La performance est cruciale pour une bonne expérience utilisateur :

- Utiliser \`useMemo\` et \`useCallback\` de manière judicieuse
- Implémenter le code splitting avec React.lazy
- Optimiser le rendu avec React.memo

## 3. Adopter TypeScript

TypeScript est devenu incontournable pour les projets React :

- Définir des interfaces claires pour les props
- Utiliser les génériques pour plus de flexibilité
- Tirer parti de l'inférence de type

## Conclusion

En suivant ces bonnes pratiques, vous pourrez créer des applications React plus maintenables et performantes.
    `,
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    author: users[0],
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Best Practices'],
    publishedAt: '2024-03-15',
    readTime: '8 min',
    likes: 42,
    comments: [
      {
        id: 'c1',
        content: 'Excellent article ! Les conseils sur TypeScript sont particulièrement utiles.',
        author: users[1],
        createdAt: '2024-03-15T14:30:00Z',
        likes: 5,
      },
    ],
  },
  {
    id: '2',
    title: 'Introduction à l\'Intelligence Artificielle pour les développeurs',
    slug: 'introduction-ia-developpeurs',
    excerpt: 'Un guide pratique pour comprendre les concepts fondamentaux de l\'IA et comment les appliquer dans vos projets.',
    content: `
# Introduction à l'Intelligence Artificielle pour les développeurs

L'Intelligence Artificielle (IA) transforme rapidement le monde du développement logiciel. Cet article vous guidera à travers les concepts fondamentaux et leur application pratique.

## Les bases de l'IA

L'IA englobe plusieurs domaines :

- Machine Learning
- Deep Learning
- Natural Language Processing
- Computer Vision

## Applications pratiques

Voici comment vous pouvez intégrer l'IA dans vos projets :

1. Analyse de données
2. Automatisation
3. Personnalisation
4. Prédiction

## Outils et frameworks

Découvrez les principaux outils :

- TensorFlow
- PyTorch
- scikit-learn
- Keras

## Conclusion

L'IA offre de nombreuses opportunités pour améliorer vos applications.
    `,
    coverImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    author: users[0],
    category: 'Data Science',
    tags: ['AI', 'Machine Learning', 'Python', 'Data Science'],
    publishedAt: '2024-03-10',
    readTime: '12 min',
    likes: 38,
    comments: [],
  },
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'Maîtriser React.js pour le développement web moderne',
    description: 'Apprenez à construire des applications web réactives et performantes avec React.js, l\'une des bibliothèques JavaScript les plus populaires. Ce cours couvre les concepts de base aux techniques avancées utilisées par les professionnels.',
    instructor: 'Marie Laurent',
    coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '12h 30min',
    featured: true,
    category: 'Web Development',
    enrollmentCount: 1245,
    rating: 4.8,
    createdAt: '2023-09-15',
    modules: [
      {
        id: 'm1',
        title: 'Introduction à React',
        chapters: [
          {
            id: 'c1',
            title: 'Qu\'est-ce que React?',
            videoUrl: 'https://example.com/video1',
            duration: '10:30',
          },
          {
            id: 'c2',
            title: 'Configurer votre environnement de développement',
            videoUrl: 'https://example.com/video2',
            duration: '15:45',
          },
        ],
      },
      {
        id: 'm2',
        title: 'Les bases de React',
        chapters: [
          {
            id: 'c3',
            title: 'Composants et Props',
            videoUrl: 'https://example.com/video3',
            duration: '20:15',
          },
          {
            id: 'c4',
            title: 'État et cycle de vie',
            videoUrl: 'https://example.com/video4',
            duration: '25:10',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'TypeScript pour les développeurs JavaScript',
    description: 'Découvrez comment TypeScript peut améliorer votre code JavaScript en ajoutant un système de types statiques. Idéal pour les développeurs qui souhaitent écrire du code plus robuste et maintenable.',
    instructor: 'Thomas Durand',
    coverImage: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '8h 45min',
    category: 'Web Development',
    enrollmentCount: 978,
    rating: 4.6,
    createdAt: '2023-10-22',
    modules: [
      {
        id: 'm1',
        title: 'Introduction à TypeScript',
        chapters: [
          {
            id: 'c1',
            title: 'Pourquoi utiliser TypeScript?',
            videoUrl: 'https://example.com/video1',
            duration: '12:20',
          },
          {
            id: 'c2',
            title: 'Configuration du projet',
            videoUrl: 'https://example.com/video2',
            duration: '18:30',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Initiation à Python pour l\'analyse de données',
    description: 'Apprenez à utiliser Python pour l\'analyse de données, de la manipulation de base à la visualisation avancée avec pandas, numpy et matplotlib.',
    instructor: 'Sophie Moreau',
    coverImage: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '14h 15min',
    featured: true,
    category: 'Data Science',
    enrollmentCount: 1876,
    rating: 4.9,
    createdAt: '2023-08-05',
    modules: [
      {
        id: 'm1',
        title: 'Les bases de Python',
        chapters: [
          {
            id: 'c1',
            title: 'Variables et types de données',
            videoUrl: 'https://example.com/video1',
            duration: '14:50',
          },
          {
            id: 'c2',
            title: 'Structures de contrôle',
            videoUrl: 'https://example.com/video2',
            duration: '22:15',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Flutter pour le développement mobile multi-plateforme',
    description: 'Créez des applications mobiles attrayantes et fonctionnelles pour iOS et Android avec un seul code base grâce à Flutter et Dart.',
    instructor: 'Lucas Martin',
    coverImage: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '16h 20min',
    category: 'Mobile Development',
    enrollmentCount: 1122,
    rating: 4.7,
    createdAt: '2023-11-10',
    modules: [
      {
        id: 'm1',
        title: 'Introduction à Flutter',
        chapters: [
          {
            id: 'c1',
            title: 'Qu\'est-ce que Flutter?',
            videoUrl: 'https://example.com/video1',
            duration: '11:40',
          },
          {
            id: 'c2',
            title: 'Installation et configuration',
            videoUrl: 'https://example.com/video2',
            duration: '19:25',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Design Thinking pour développeurs',
    description: 'Apprenez à concevoir des produits centrés sur l\'utilisateur en appliquant les principes du Design Thinking dans votre processus de développement.',
    instructor: 'Émilie Dubois',
    coverImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '7h 50min',
    category: 'Design',
    enrollmentCount: 843,
    rating: 4.5,
    createdAt: '2023-12-01',
    modules: [
      {
        id: 'm1',
        title: 'Les principes du Design Thinking',
        chapters: [
          {
            id: 'c1',
            title: 'Empathie et définition du problème',
            videoUrl: 'https://example.com/video1',
            duration: '16:35',
          },
          {
            id: 'c2',
            title: 'Idéation et prototypage',
            videoUrl: 'https://example.com/video2',
            duration: '20:10',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Docker et Kubernetes pour le déploiement d\'applications',
    description: 'Maîtrisez la conteneurisation avec Docker et l\'orchestration avec Kubernetes pour déployer des applications scalables et résilientes.',
    instructor: 'Alexandre Blanc',
    coverImage: 'https://images.pexels.com/photos/7504837/pexels-photo-7504837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    duration: '15h 30min',
    featured: true,
    category: 'DevOps',
    enrollmentCount: 756,
    rating: 4.7,
    createdAt: '2024-01-15',
    modules: [
      {
        id: 'm1',
        title: 'Introduction à Docker',
        chapters: [
          {
            id: 'c1',
            title: 'Les bases de la conteneurisation',
            videoUrl: 'https://example.com/video1',
            duration: '13:20',
          },
          {
            id: 'c2',
            title: 'Création de Dockerfiles',
            videoUrl: 'https://example.com/video2',
            duration: '24:45',
          },
        ],
      },
    ],
  },
];

export const mentoringRequests: MentoringRequest[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Student User',
    email: 'student@example.com',
    topic: 'Conseils sur le développement de carrière',
    message: 'J\'aimerais discuter des différentes voies possibles pour évoluer en tant que développeur front-end et obtenir des conseils personnalisés.',
    status: 'pending',
    preferredDate: '2024-05-20T14:00:00',
    createdAt: '2024-05-01T09:23:45',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Another Student',
    email: 'another@example.com',
    topic: 'Revue de code pour projet React',
    message: 'J\'ai développé une application React et j\'aimerais avoir un retour d\'expert sur mon architecture et mes pratiques de codage.',
    status: 'approved',
    preferredDate: '2024-05-15T10:30:00',
    createdAt: '2024-04-28T15:42:10',
  },
];

export const currentUser: User = users[0];