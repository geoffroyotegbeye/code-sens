import React from 'react';
import { Course, Module, Lesson } from '../../../types/course';
import ModuleItem from './ModuleItem';

interface ModulesListProps {
  course: Course;
  expandedModules: { [key: string]: boolean };
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
  selectedLessonId: string | null;
}

const ModulesList: React.FC<ModulesListProps> = ({
  course,
  expandedModules,
  onToggleModule,
  onSelectLesson,
  selectedLessonId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Contenu de la formation</h2>
      <div className="space-y-4">
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((module, index) => (
            <ModuleItem
              key={module._id || `module-${index}`}
              module={module}
              isExpanded={expandedModules[`module-${index}`]}
              onToggle={() => onToggleModule(`module-${index}`)}
              onSelectLesson={onSelectLesson}
              selectedLessonId={selectedLessonId}
              moduleIndex={index}
            />
          ))
        ) : (
          <p className="text-gray-500">Aucun module disponible pour cette formation.</p>
        )}
      </div>
    </div>
  );
};

export default ModulesList;
