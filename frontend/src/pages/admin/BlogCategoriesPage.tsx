import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { blogApi } from '../../services/blogApi';
import { Category } from '../../types/blog';
import toast from 'react-hot-toast';
import { Edit, Trash2, Save, Plus, Search, X, Loader } from 'lucide-react';

const BlogCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Charger les catégories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await blogApi.getCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Filtrer les catégories en fonction de la recherche
  useEffect(() => {
    if (!categories.length) return;
    
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(term) || 
      (category.description && category.description.toLowerCase().includes(term)) ||
      category.slug.toLowerCase().includes(term)
    );
    
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  // Valider le formulaire
  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    let isValid = true;

    if (!newCategory.name.trim()) {
      newErrors.name = 'Le nom est requis';
      isValid = false;
    } else if (newCategory.name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères';
      isValid = false;
    }

    if (newCategory.description && newCategory.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Ouvrir le modal de création
  const openCreateModal = () => {
    setNewCategory({ name: '', description: '' });
    setErrors({});
    setShowCreateModal(true);
  };

  // Fermer le modal de création
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewCategory({ name: '', description: '' });
    setErrors({});
  };

  // Ajouter une catégorie
  const handleAddCategory = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newCat = await blogApi.createCategory(newCategory);
      setCategories([...categories, newCat]);
      setNewCategory({ name: '', description: '' });
      toast.success('Catégorie ajoutée avec succès');
      closeCreateModal();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      if (error.message.includes('existe déjà')) {
        toast.error('Une catégorie avec ce nom existe déjà');
      } else {
        toast.error('Erreur lors de l\'ajout de la catégorie');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Valider le formulaire d'édition
  const validateEditForm = () => {
    if (!editingCategory) return false;

    const newErrors: { name?: string; description?: string } = {};
    let isValid = true;

    if (!editingCategory.name.trim()) {
      newErrors.name = 'Le nom est requis';
      isValid = false;
    } else if (editingCategory.name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères';
      isValid = false;
    }

    if (editingCategory.description && editingCategory.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Ouvrir le modal d'édition
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setErrors({});
    setShowEditModal(true);
  };

  // Fermer le modal d'édition
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setErrors({});
  };

  // Mettre à jour une catégorie
  const handleUpdateCategory = async () => {
    if (!editingCategory || !validateEditForm()) return;

    setIsSubmitting(true);
    try {
      const updatedCat = await blogApi.updateCategory(editingCategory._id, {
        name: editingCategory.name,
        description: editingCategory.description,
      });

      setCategories(categories.map((cat) => (cat._id === updatedCat._id ? updatedCat : cat)));
      closeEditModal();
      toast.success('Catégorie mise à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      if (error.message.includes('déjà utilisé')) {
        toast.error('Une catégorie avec ce nom existe déjà');
      } else {
        toast.error('Erreur lors de la mise à jour de la catégorie');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ouvrir le modal de suppression
  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Fermer le modal de suppression
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await blogApi.deleteCategory(categoryToDelete._id);
      setCategories(categories.filter((cat) => cat._id !== categoryToDelete._id));
      closeDeleteModal();
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des catégories</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une catégorie
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau des catégories */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr key="loading-row">
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <Loader size={24} className="animate-spin text-blue-600 mr-2" />
                      <span className="text-gray-600">Chargement des catégories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr key="empty-row">
                  <td colSpan={4} className="px-6 py-4 text-center">
                    {searchTerm ? 'Aucune catégorie ne correspond à votre recherche' : 'Aucune catégorie trouvée'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.slug}</td>
                    <td className="px-6 py-4">{category.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 flex items-center"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-1 rounded text-red-600 hover:bg-red-100 flex items-center"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de création de catégorie */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ajouter une catégorie</h2>
                <button onClick={closeCreateModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={closeCreateModal}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="mr-2" />
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de modification de catégorie */}
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Modifier la catégorie</h2>
                <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={closeEditModal}
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? 'Mise à jour en cours...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && categoryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Confirmer la suppression</h2>
                <button onClick={closeDeleteModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <p className="mb-4">
                Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold">{categoryToDelete.name}</span> ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={closeDeleteModal}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} className="mr-2" />
                  {isSubmitting ? 'Suppression en cours...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogCategoriesPage;
