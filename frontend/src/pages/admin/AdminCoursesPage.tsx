import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import { Plus, ChevronRight, ChevronDown, Edit, Trash2, FileText, Video, HelpCircle, Eye, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { courseService } from '../../services/courseApi';
import { categoryService } from '../../services/categoryApi';
import { Course, Module, Lesson } from '../../types/course';
import { Category } from '../../types/category';
import { Link, useNavigate } from 'react-router-dom';

const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'course' | 'module' | 'lesson'>('course');
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    // Course
    title: '',
    description: '',
    category_id: '',
    price: 0,
    level: 'beginner' as const,
    language: 'fr',
    prerequisites: [] as string[],
    objectives: [] as string[],
    // Module
    moduleTitle: '',
    moduleDescription: '',
    // Lesson
    lessonTitle: '',
    lessonDescription: '',
    lessonContent: '',
    lessonDuration: 0,
    lessonType: 'video' as const,
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      setLoading(true);
    
    try {
      // Charger les catégories
      console.log('Chargement des catégories...');
      const categoriesData = await categoryService.getAllCategories();
      console.log('Catégories chargées:', categoriesData);
      setCategories(categoriesData);

      // Charger les formations
      console.log('Chargement des formations...');
      const coursesData = await courseService.getAllCourses();
      console.log('Formations chargées:', coursesData);
      setCourses(coursesData);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      if (error instanceof Error) {
        toast.error(`Erreur: ${error.message}`);
      } else {
        toast.error('Une erreur est survenue lors du chargement des données');
      }
    } finally {
          setLoading(false);
    }
  };

  const handleOpenModal = (step: 'course' | 'module' | 'lesson', course?: Course, module?: Module) => {
    setModalStep(step);
    if (course) setSelectedCourse(course);
    if (module) setSelectedModule(module);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setSelectedModule(null);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      price: 0,
      level: 'beginner',
      language: 'fr',
      prerequisites: [],
      objectives: [],
      moduleTitle: '',
      moduleDescription: '',
      lessonTitle: '',
      lessonDescription: '',
      lessonContent: '',
      lessonDuration: 0,
      lessonType: 'video',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (modalStep) {
        case 'course':
          if (!formData.category_id) {
            toast.error('Veuillez sélectionner une catégorie');
            return;
          }
          await courseService.createCourse({
            title: formData.title,
            description: formData.description,
            category_id: formData.category_id,
            price: Number(formData.price),
            level: formData.level,
            language: formData.language,
            prerequisites: formData.prerequisites,
            objectives: formData.objectives,
          });
          toast.success('Formation créée avec succès');
          break;

        case 'module':
          if (!selectedCourse) {
            toast.error('Aucun cours sélectionné');
            return;
          }
          if (!formData.moduleTitle) {
            toast.error('Veuillez entrer un titre pour le module');
            return;
          }
          await courseService.addModule(selectedCourse._id, {
            title: formData.moduleTitle,
            description: formData.moduleDescription,
            order: selectedCourse.modules.length + 1,
          });
          toast.success('Module ajouté avec succès');
          break;

        case 'lesson':
          if (!selectedCourse || !selectedModule) {
            toast.error('Aucun module sélectionné');
            return;
          }
          if (!formData.lessonTitle || !formData.lessonContent) {
            toast.error('Veuillez remplir tous les champs requis pour la leçon');
            return;
          }
          await courseService.addLesson(selectedCourse._id, selectedModule.order - 1, {
            title: formData.lessonTitle,
            description: formData.lessonDescription,
            content: formData.lessonContent,
            duration: Number(formData.lessonDuration),
            type: formData.lessonType,
            order: selectedModule.lessons.length + 1,
          });
          toast.success('Leçon ajoutée avec succès');
          break;
      }
      handleCloseModal();
      fetchData();
      } catch (error) {
      console.error('Erreur:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l'opération");
      }
    }
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 'course':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Nouvelle formation</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
          </div>
        );

      case 'module':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Nouveau module</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre du module</label>
              <input
                type="text"
                name="moduleTitle"
                value={formData.moduleTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description du module</label>
              <textarea
                name="moduleDescription"
                value={formData.moduleDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
        );

      case 'lesson':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Nouvelle leçon</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la leçon</label>
              <input
                type="text"
                name="lessonTitle"
                value={formData.lessonTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="lessonDescription"
                value={formData.lessonDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
              <textarea
                name="lessonContent"
                value={formData.lessonContent}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input
                type="number"
                name="lessonDuration"
                value={formData.lessonDuration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de contenu</label>
              <select
                name="lessonType"
                value={formData.lessonType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="video">Vidéo</option>
                <option value="text">Texte</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
          </div>
        );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      try {
        await courseService.deleteCourse(id);
        toast.success('Cours supprimé avec succès');
        fetchData();
      } catch (err) {
        toast.error('Erreur lors de la suppression du cours');
      }
    }
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setViewModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category_id: course.category_id,
      price: course.price,
      level: course.level,
      language: course.language,
      prerequisites: course.prerequisites || [],
      objectives: course.objectives || [],
      moduleTitle: '',
      moduleDescription: '',
      lessonTitle: '',
      lessonDescription: '',
      lessonContent: '',
      lessonDuration: 0,
      lessonType: 'video',
    });
    setEditModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };

  const handleAddModule = (course: Course) => {
    setSelectedCourse(course);
    setModalStep('module');
    setFormData({
      ...formData,
      moduleTitle: '',
      moduleDescription: '',
    });
    setAddModuleModalOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!formData.category_id) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      await courseService.updateCourse(selectedCourse._id, {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        price: Number(formData.price),
        level: formData.level,
        language: formData.language,
        prerequisites: formData.prerequisites,
        objectives: formData.objectives,
      });
      toast.success('Cours mis à jour avec succès');
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erreur lors de la mise à jour du cours');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourse) return;
    try {
      await courseService.deleteCourse(selectedCourse._id);
      toast.success('Cours supprimé avec succès');
      setDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression du cours');
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleViewModules = (courseId: string) => {
    navigate(`/admin/courses/${courseId}/modules`);
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Formations</h1>
          <Link
            to="/admin/courses/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} /> Nouveau Cours
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-4">Aucune formation trouvée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                    {course.modules.length > 0 && (
                      <button
                        onClick={() => handleViewModules(course._id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                        title="Voir les modules"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{truncateText(course.description, 150)}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Niveau</span>
                      <p className="font-medium">{course.level}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Prix</span>
                      <p className="font-medium">{course.price} €</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Modules</span>
                      <p className="font-medium">{course.modules.length}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Statut</span>
                      <p className="font-medium">{course.is_active ? 'Actif' : 'Inactif'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleViewCourse(course)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                        title="Voir"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Edit size={20} />
                      </button>
                    </div>
                    <div className="flex space-x-4">
                        <button
                        onClick={() => handleAddModule(course)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                        title="Ajouter un module"
                      >
                        <BookOpen size={20} />
                        </button>
                          <button
                        onClick={() => handleDeleteCourse(course)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                        title="Supprimer"
                          >
                        <Trash2 size={20} />
                          </button>
                        </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de visualisation */}
        {viewModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">{selectedCourse.title}</h2>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedCourse.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Niveau</h3>
                    <p>{selectedCourse.level}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Prix</h3>
                    <p>{selectedCourse.price} €</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Langue</h3>
                    <p>{selectedCourse.language}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Statut</h3>
                    <p>{selectedCourse.is_active ? 'Actif' : 'Inactif'}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setViewModalOpen(false)}>Fermer</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition */}
        {editModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Modifier le cours</h2>
              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de suppression */}
        {deleteModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
              <p className="mb-4">Êtes-vous sûr de vouloir supprimer le cours "{selectedCourse.title}" ?</p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'ajout de module */}
        {addModuleModalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Ajouter un module</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre du module</label>
                  <input
                    type="text"
                    name="moduleTitle"
                    value={formData.moduleTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description du module</label>
                  <textarea
                    name="moduleDescription"
                    value={formData.moduleDescription}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setAddModuleModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
