import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
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
      navigate('/admin');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Créer une nouvelle formation</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <CourseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateCoursePage;