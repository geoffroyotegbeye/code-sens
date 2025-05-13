import React, { useState } from 'react';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { Course, Module, Chapter } from '../../types';

interface CourseFormProps {
  initialCourse?: Course;
  onSubmit: (course: Partial<Course>) => void;
  isLoading?: boolean;
}

const emptyModule: Omit<Module, 'id'> = {
  title: '',
  chapters: [],
};

const emptyChapter: Omit<Chapter, 'id'> = {
  title: '',
  videoUrl: '',
  duration: '',
};

const CourseForm: React.FC<CourseFormProps> = ({
  initialCourse,
  onSubmit,
  isLoading = false,
}) => {
  const [course, setCourse] = useState<Partial<Course>>(
    initialCourse || {
      title: '',
      description: '',
      instructor: '',
      coverImage: '',
      duration: '',
      featured: false,
      category: '',
      modules: [],
    }
  );

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setCourse((prev) => ({ ...prev, [name]: newValue }));
  };

  const addModule = () => {
    setCourse((prev) => ({
      ...prev,
      modules: [...(prev.modules || []), { ...emptyModule, id: `m-${Date.now()}` }],
    }));
    // Auto-expand the newly added module
    setExpandedModules((prev) => ({
      ...prev,
      [(prev.modules?.length || 0)]: true,
    }));
  };

  const removeModule = (index: number) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (index: number, updates: Partial<Module>) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules?.map((module, i) => (i === index ? { ...module, ...updates } : module)),
    }));
  };

  const addChapter = (moduleIndex: number) => {
    setCourse((prev) => {
      const updatedModules = [...(prev.modules || [])];
      if (updatedModules[moduleIndex]) {
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          chapters: [
            ...(updatedModules[moduleIndex].chapters || []),
            { ...emptyChapter, id: `c-${Date.now()}` },
          ],
        };
      }
      return { ...prev, modules: updatedModules };
    });
  };

  const removeChapter = (moduleIndex: number, chapterIndex: number) => {
    setCourse((prev) => {
      const updatedModules = [...(prev.modules || [])];
      if (updatedModules[moduleIndex]) {
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          chapters: updatedModules[moduleIndex].chapters.filter((_, i) => i !== chapterIndex),
        };
      }
      return { ...prev, modules: updatedModules };
    });
  };

  const updateChapter = (moduleIndex: number, chapterIndex: number, updates: Partial<Chapter>) => {
    setCourse((prev) => {
      const updatedModules = [...(prev.modules || [])];
      if (updatedModules[moduleIndex] && updatedModules[moduleIndex].chapters[chapterIndex]) {
        const updatedChapters = [...updatedModules[moduleIndex].chapters];
        updatedChapters[chapterIndex] = {
          ...updatedChapters[chapterIndex],
          ...updates,
        };
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          chapters: updatedChapters,
        };
      }
      return { ...prev, modules: updatedModules };
    });
  };

  const toggleModuleExpansion = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(course);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la formation
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
            Formateur
          </label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={course.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="Web Development">Développement Web</option>
            <option value="Mobile Development">Développement Mobile</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Durée totale (ex: 12h 30min)
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={course.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
            Image de couverture (URL)
          </label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            value={course.coverImage}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center h-10">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="featured"
              checked={course.featured}
              onChange={handleChange}
              className="mr-2 rounded border-gray-300 focus:ring-blue-500"
            />
            Mettre en avant sur la page d'accueil
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Modules & Chapitres</h3>
          <Button 
            type="button" 
            size="sm"
            onClick={addModule}
            variant="outline"
          >
            <Plus size={16} className="mr-1" /> Ajouter un module
          </Button>
        </div>

        <div className="space-y-4">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border rounded-md">
                <div className="flex items-center justify-between bg-gray-50 p-3 cursor-pointer" onClick={() => toggleModuleExpansion(moduleIndex)}>
                  <div className="flex items-center">
                    {expandedModules[moduleIndex] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    <h4 className="ml-2 font-medium">{module.title || `Module ${moduleIndex + 1}`}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeModule(moduleIndex);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                {expandedModules[moduleIndex] && (
                  <div className="p-4 border-t">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre du module
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, { title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Ex: Introduction à React"
                      />
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700">Chapitres</h5>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          onClick={() => addChapter(moduleIndex)}
                        >
                          <Plus size={14} className="mr-1" /> Ajouter
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {module.chapters && module.chapters.length > 0 ? (
                          module.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter.id} className="border rounded-md p-3">
                              <div className="flex justify-between items-start">
                                <h6 className="text-sm font-medium">
                                  {chapter.title || `Chapitre ${chapterIndex + 1}`}
                                </h6>
                                <button
                                  type="button"
                                  onClick={() => removeChapter(moduleIndex, chapterIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    Titre du chapitre
                                  </label>
                                  <input
                                    type="text"
                                    value={chapter.title}
                                    onChange={(e) =>
                                      updateChapter(moduleIndex, chapterIndex, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    placeholder="Ex: Introduction aux hooks"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    Durée (ex: 10:30)
                                  </label>
                                  <input
                                    type="text"
                                    value={chapter.duration}
                                    onChange={(e) =>
                                      updateChapter(moduleIndex, chapterIndex, {
                                        duration: e.target.value,
                                      })
                                    }
                                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    placeholder="MM:SS"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs text-gray-600 mb-1">
                                    URL de la vidéo
                                  </label>
                                  <input
                                    type="url"
                                    value={chapter.videoUrl || ''}
                                    onChange={(e) =>
                                      updateChapter(moduleIndex, chapterIndex, {
                                        videoUrl: e.target.value,
                                      })
                                    }
                                    className="w-full p-1.5 text-sm border border-gray-300 rounded-md"
                                    placeholder="https://example.com/video.mp4"
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-3 border border-dashed rounded-md">
                            <p className="text-sm text-gray-500">
                              Aucun chapitre. Cliquez sur "Ajouter" pour créer un chapitre.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed rounded-md">
              <p className="text-gray-500 mb-3">
                Aucun module. Ajoutez des modules pour structurer votre formation.
              </p>
              <Button type="button" size="sm" onClick={addModule} variant="outline">
                <Plus size={16} className="mr-1" /> Ajouter le premier module
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => window.history.back()}
        >
          Annuler
        </Button>
        <Button type="submit" isLoading={isLoading} className="text-white">
          {initialCourse ? 'Mettre à jour' : 'Créer la formation'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;