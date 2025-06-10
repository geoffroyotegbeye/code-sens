import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import CourseForm from '../components/admin/CourseForm';
import { Course } from '../types';

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (courseData: Partial<Course>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to admin courses page after successful creation
      navigate('/admin/courses');
    }, 1500);
  };
  
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Créer une nouvelle formation</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <CourseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;