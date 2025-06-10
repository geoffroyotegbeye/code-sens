import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { courseService } from '../../services/courseApi';
import { Course, Module, Lesson } from '../../types/course';
import { ChevronRight, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import des sous-composants
import ModulesList from '../../components/admin/modules/ModulesList';
import LessonContent from '../../components/admin/modules/LessonContent';
import AddModuleModal from '../../components/admin/modules/AddModuleModal';
import EditModuleModal from '../../components/admin/modules/EditModuleModal';
import AddLessonModal from '../../components/admin/modules/AddLessonModal';

const AdminCourseModulesPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  // Pas besoin de modal pour visualiser les leçons, elles s'affichent directement dans la section de droite
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration: 0,
    type: 'video' as 'video' | 'text' | 'quiz',
    videoUrl: '',
    attachments: [] as File[],
  });
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'content' | 'attachments'>('content');
  const [isEditingLesson, setIsEditingLesson] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }

    // Écouter l'événement d'erreur d'authentification
    const handleUnauthorized = () => {
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [courseId, navigate]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(courseId!);
      setCourse(data);
    } catch (error) {
      toast.error('Erreur lors du chargement de la formation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      await courseService.addModule(course._id, {
        title: formData.title,
        description: formData.description,
        order: course.modules.length + 1,
      });
      toast.success('Module ajouté avec succès');
      setIsAddModuleModalOpen(false);
      setFormData({ title: '', description: '' });
      fetchCourse();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du module');
    }
  };

  const handleEditModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !selectedModule) return;

    try {
      await courseService.updateModule(course._id, selectedModule.order - 1, {
        title: formData.title,
        description: formData.description,
        order: selectedModule.order,
      });
      toast.success('Module mis à jour avec succès');
      setIsEditModuleModalOpen(false);
      setFormData({ title: '', description: '' });
      fetchCourse();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du module');
    }
  };

  const handleDeleteModule = async (moduleIndex: number) => {
    if (!course) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      try {
        await courseService.deleteModule(course._id, moduleIndex);
        toast.success('Module supprimé avec succès');
        fetchCourse();
      } catch (error) {
        toast.error('Erreur lors de la suppression du module');
      }
    }
  };

  const handleEditLesson = (lesson: Lesson, module: Module) => {
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content,
      duration: lesson.duration,
      type: lesson.type,
      videoUrl: lesson.type === 'video' ? lesson.videoUrl || lesson.video_url || '' : '',
      attachments: [],
    });
    setIsEditingLesson(true);
    setIsAddLessonModalOpen(true);
  };

  const handleAddOrUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !selectedModule) return;

    try {
      if (lessonFormData.type === 'video' && !lessonFormData.videoUrl) {
        toast.error('Veuillez fournir l\'URL de la vidéo');
        return;
      }

      if (isEditingLesson && selectedLesson) {
        // Mise à jour de la leçon existante
        const updateData = {
          title: lessonFormData.title,
          description: lessonFormData.description,
          content: lessonFormData.content,
          duration: lessonFormData.duration,
          type: lessonFormData.type,
          order: selectedLesson.order,
          video_url: lessonFormData.type === 'video' ? lessonFormData.videoUrl : undefined,
        };
        await courseService.updateLesson(
          course._id,
          selectedModule.order - 1,
          selectedLesson.order - 1,
          updateData
        );
        toast.success('Leçon mise à jour avec succès');
      } else {
        // Ajout d'une nouvelle leçon
        const newLessonData = {
          title: lessonFormData.title,
          description: lessonFormData.description,
          content: lessonFormData.content,
          duration: lessonFormData.duration,
          type: lessonFormData.type,
          order: selectedModule.lessons.length + 1,
          video_url: lessonFormData.type === 'video' ? lessonFormData.videoUrl : undefined,
          attachments: lessonFormData.attachments,
        };
        await courseService.addLesson(course._id, selectedModule.order - 1, newLessonData);
        toast.success('Leçon ajoutée avec succès');
      }

      setIsAddLessonModalOpen(false);
      setIsEditingLesson(false);
      setSelectedLesson(null);
      setLessonFormData({
        title: '',
        description: '',
        content: '',
        duration: 0,
        type: 'video',
        videoUrl: '',
        attachments: [],
      });
      fetchCourse();
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      if (error.response?.status === 401) {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(isEditingLesson ? 'Erreur lors de la mise à jour de la leçon' : 'Erreur lors de l\'ajout de la leçon');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLessonFormData({
        ...lessonFormData,
        attachments: [...lessonFormData.attachments, ...Array.from(e.target.files)],
      });
    }
  };

  const removeAttachment = (index: number) => {
    setLessonFormData({
      ...lessonFormData,
      attachments: lessonFormData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // Ne plus ouvrir la modal, juste sélectionner la leçon pour l'afficher dans la rubrique de droite
  };

  const toggleModule = (moduleId: string) => {
    console.log('Module ID cliqué:', moduleId);
    console.log('État actuel des modules:', expandedModules);
    
    // Vérifier si moduleId est une chaîne valide
    if (!moduleId || typeof moduleId !== 'string') {
      console.error('moduleId invalide:', moduleId);
      return;
    }
    
    setExpandedModules(prev => {
      console.log('État précédent:', prev);
      
      // Si le module est déjà ouvert, on le ferme simplement
      if (prev[moduleId]) {
        console.log('Fermeture du module:', moduleId);
        return {
          ...prev,
          [moduleId]: false
        };
      }
      
      // Sinon, on ferme tous les modules et on ouvre celui-ci
      const newState: { [key: string]: boolean } = {};
      // Initialiser tous les modules à fermé
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      // Ouvrir uniquement le module sélectionné
      newState[moduleId] = true;
      
      console.log('Nouvel état:', newState);
      return newState;
    });
  };

  const handleDeleteLesson = async (moduleIndex: number, lessonIndex: number) => {
    if (!course) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      try {
        await courseService.deleteLesson(course._id, moduleIndex, lessonIndex);
        toast.success('Leçon supprimée avec succès');
        fetchCourse();
      } catch (error) {
        toast.error('Erreur lors de la suppression de la leçon');
      }
    }
  };

  const getEmbedUrl = (url: string) => {
    // Si c'est une URL YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1].split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleOpenAddModuleModal = () => {
    setFormData({ title: '', description: '' });
    setIsAddModuleModalOpen(true);
  };

  const handleOpenAddLessonModal = (module: Module) => {
    setSelectedModule(module);
    setLessonFormData({
      title: '',
      description: '',
      content: '',
      duration: 0,
      type: 'video',
      videoUrl: '',
      attachments: [],
    });
    setIsAddLessonModalOpen(true);
  };

  const handleOpenEditModuleModal = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      title: module.title,
      description: module.description || '',
    });
    setIsEditModuleModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-4">Chargement...</div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="text-center py-4">Formation non trouvée</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Fil d'Ariane et Bouton */}
        <div className="mb-6 flex justify-between items-center">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/admin/courses" className="text-gray-700 hover:text-blue-600">
                  Formations
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{course.title}</span>
                </div>
              </li>
            </ol>
          </nav>
          <button
            onClick={handleOpenAddModuleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Nouveau Module
          </button>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des modules et leçons */}
          <ModulesList
            course={course}
            expandedModules={expandedModules}
            onToggleModule={toggleModule}
            onAddModule={handleOpenAddModuleModal}
            onAddLesson={handleOpenAddLessonModal}
            onEditModule={handleOpenEditModuleModal}
            onDeleteModule={handleDeleteModule}
            onEditLesson={handleEditLesson}
            onViewLesson={handleViewLesson}
            onDeleteLesson={handleDeleteLesson}
          />

          {/* Contenu de la leçon sélectionnée */}
          <div className="lg:col-span-2">
            <LessonContent
              selectedLesson={selectedLesson}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              getEmbedUrl={getEmbedUrl}
            />
          </div>
        </div>

        {/* Modales */}
        <AddModuleModal
          isOpen={isAddModuleModalOpen}
          onClose={() => setIsAddModuleModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddModule}
        />

        <EditModuleModal
          isOpen={isEditModuleModalOpen}
          onClose={() => setIsEditModuleModalOpen(false)}
          selectedModule={selectedModule}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditModule}
        />

        <AddLessonModal
          isOpen={isAddLessonModalOpen}
          onClose={() => {
            setIsAddLessonModalOpen(false);
            setIsEditingLesson(false);
            setSelectedLesson(null);
          }}
          selectedModule={selectedModule}
          selectedLesson={selectedLesson}
          isEditing={isEditingLesson}
          lessonFormData={lessonFormData}
          setLessonFormData={setLessonFormData}
          onSubmit={handleAddOrUpdateLesson}
          handleFileChange={handleFileChange}
          removeAttachment={removeAttachment}
        />

        {/* Le contenu de la leçon s'affiche directement dans la rubrique de droite */}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseModulesPage;
