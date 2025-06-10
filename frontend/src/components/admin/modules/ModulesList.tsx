import React from 'react';
import { Plus } from 'lucide-react';
import { Course, Module, Lesson } from '../../../types/course';
import ModuleItem from './ModuleItem';

interface ModulesListProps {
  course: Course;
  expandedModules: { [key: string]: boolean };
  onToggleModule: (moduleId: string) => void;
  onAddModule: () => void;
  onAddLesson: (module: Module) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleIndex: number) => void;
  onEditLesson: (lesson: Lesson, module: Module) => void;
  onViewLesson: (lesson: Lesson) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
}

const ModulesList: React.FC<ModulesListProps> = ({
  course,
  expandedModules,
  onToggleModule,
  onAddModule,
  onAddLesson,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onViewLesson,
  onDeleteLesson,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Contenu du cours</h2>
          <button
            onClick={onAddModule}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1 transition-colors text-sm"
          >
            <Plus size={14} /> Module
          </button>
        </div>
        <div className="divide-y">
          {course.modules.map((module, index) => (
            <ModuleItem
              key={module._id}
              module={module}
              index={index}
              isExpanded={!!expandedModules[`module-${index}`]}
              onToggle={onToggleModule}
              onAddLesson={onAddLesson}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
              onEditLesson={onEditLesson}
              onViewLesson={onViewLesson}
              onDeleteLesson={onDeleteLesson}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesList;
