import React from 'react';
import { Course } from '../../types';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  title?: string;
  subtitle?: string;
  columns?: number;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  title, 
  subtitle,
  columns = 3
}) => {
  // Generate grid columns class based on the columns prop
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      {courses.length > 0 ? (
        <div className={`grid ${gridColumnsClass} gap-6`}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune formation disponible.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;