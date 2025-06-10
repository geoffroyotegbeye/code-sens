import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import CourseList from '../components/courses/CourseList';
import { courseService } from '../services/courseApi';
import { categoryService } from '../services/categoryApi';
import { Course } from '../types/course';
import { Category } from '../types/category';
import { toast } from 'react-hot-toast';

const CoursesPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData, categoriesData] = await Promise.all([
        courseService.getAllCourses(),
        categoryService.getAllCategories()
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
      setFilteredCourses(coursesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Une erreur est survenue lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory ? course.category_id === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, courses]);
  
  // Set category from URL parameter
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== '';
  
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-blue-900 text-white py-12 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Catalogue de formations</h1>
          <p className="text-blue-100 max-w-3xl">
            Explorez notre sélection de formations et trouvez celle qui correspond à vos besoins.
          </p>
        </div>
      </section>
      
      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={toggleFilters}
              className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Filter size={18} className="mr-2" />
              Filtres
            </button>
            
            {/* Categories (Desktop) */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryChange(category._id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm md:hidden">
              <h3 className="font-medium mb-3">Catégories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50"
                >
                  <X size={14} className="mr-1" />
                  Effacer tous les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Course List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des formations...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredCourses.length} formation{filteredCourses.length > 1 ? 's' : ''} trouvée{filteredCourses.length > 1 ? 's' : ''}
                  {hasActiveFilters && ' pour votre recherche'}
                </p>
              </div>
              <CourseList courses={filteredCourses} columns={3} />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">Aucune formation trouvée</h2>
              <p className="text-gray-600 mb-6">
                Aucune formation ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default CoursesPage;