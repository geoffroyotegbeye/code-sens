import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star } from 'lucide-react';
import { Course } from '../../types/course';
import Card from '../ui/Card';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card hoverable className="h-full flex flex-col">
      <Link to={`/courses/${course._id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.coverImage} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {course.featured && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Recommandé
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold line-clamp-2">{course.title}</h3>
          </div>
        </div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/courses/${course._id}`} className="block mb-2">
          <p className="text-gray-600 line-clamp-2 text-sm mb-3">
            {course.description}
          </p>
        </Link>
        <div className="mt-auto">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{course.enrollmentCount}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium text-blue-900">Par {course.instructor}</span>
            <div className="flex items-center text-sm">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;