import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Module, Lesson } from '../../../types/course';
import LessonItem from './LessonItem';

interface ModuleItemProps {
  module: Module;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  selectedLessonId: string | null;
  moduleIndex: number;
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  isExpanded,
  onToggle,
  onSelectLesson,
  selectedLessonId,
  moduleIndex,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h3 className="font-medium text-lg">{module.title}</h3>
          <p className="text-sm text-gray-500">
            {module.lessons?.length || 0} leçon{(module.lessons?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>
        <div>
          {isExpanded ? (
            <ChevronUp className="text-gray-600" />
          ) : (
            <ChevronDown className="text-gray-600" />
          )}
        </div>
      </div>

      {isExpanded && module.lessons && (
        <div className="border-t">
          {module.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson._id || `lesson-${moduleIndex}-${index}`}
              lesson={lesson}
              isSelected={selectedLessonId === lesson._id}
              onClick={() => onSelectLesson(lesson)}
              isLast={index === module.lessons.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
