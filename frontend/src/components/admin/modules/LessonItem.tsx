import React from 'react';
import { Video, HelpCircle, FileText, Edit, Trash2 } from 'lucide-react';
import { Lesson, Module } from '../../../types/course';

interface LessonItemProps {
  lesson: Lesson;
  lessonIndex: number;
  moduleOrder: number;
  module: Module;
  onEditLesson: (lesson: Lesson, module: Module) => void;
  onViewLesson: (lesson: Lesson) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  lessonIndex,
  moduleOrder,
  module,
  onEditLesson,
  onViewLesson,
  onDeleteLesson,
}) => {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50`}
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => onViewLesson(lesson)}
        >
          {lesson.type === 'video' ? (
            <Video size={16} className="text-blue-500" />
          ) : lesson.type === 'quiz' ? (
            <HelpCircle size={16} className="text-purple-500" />
          ) : (
            <FileText size={16} className="text-green-500" />
          )}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
            <p className="text-xs text-gray-500">{lesson.duration} min</p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditLesson(lesson, module);
            }}
            className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-full transition-colors"
            title="Modifier la leçon"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLesson(moduleOrder - 1, lessonIndex);
            }}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
            title="Supprimer la leçon"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonItem;
