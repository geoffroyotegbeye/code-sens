import React from 'react';
import { Play, Check } from 'lucide-react';
import { Lesson } from '../../../types/course';

interface LessonItemProps {
  lesson: Lesson;
  isSelected: boolean;
  onClick: () => void;
  isLast: boolean;
  isCompleted?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  isSelected,
  onClick,
  isLast,
  isCompleted = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50' : ''
      } ${!isLast ? 'border-b' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${
          isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {isCompleted ? <Check size={14} /> : <Play size={14} />}
        </div>
        <div>
          <h4 className="font-medium">{lesson.title}</h4>
          <p className="text-sm text-gray-500">{lesson.duration} min</p>
        </div>
      </div>
      {isSelected && (
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};

export default LessonItem;
