import React from 'react';
import { ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Module, Lesson } from '../../../types/course';
import LessonItem from './LessonItem';

interface ModuleItemProps {
  module: Module;
  index: number;
  isExpanded: boolean;
  onToggle: (moduleId: string) => void;
  onAddLesson: (module: Module) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleIndex: number) => void;
  onEditLesson: (lesson: Lesson, module: Module) => void;
  onViewLesson: (lesson: Lesson) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  index,
  isExpanded,
  onToggle,
  onAddLesson,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onViewLesson,
  onDeleteLesson,
}) => {
  return (
    <div className="bg-white">
      {/* En-tête du module */}
      <div
        className="p-4 hover:bg-gray-50 cursor-pointer"
        onClick={() => onToggle(`module-${index}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight
              size={16}
              className={`transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
            <div>
              <h3 className="font-medium text-gray-900">Module {module.order}</h3>
              <p className="text-sm text-gray-500">{module.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddLesson(module);
              }}
              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
              title="Ajouter une leçon"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditModule(module);
              }}
              className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteModule(index);
              }}
              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des leçons */}
      {isExpanded && (
        <div className="pl-12 pr-4 pb-4 space-y-2">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson._id}
              lesson={lesson}
              lessonIndex={lessonIndex}
              moduleOrder={module.order}
              module={module}
              onEditLesson={onEditLesson}
              onViewLesson={onViewLesson}
              onDeleteLesson={onDeleteLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
