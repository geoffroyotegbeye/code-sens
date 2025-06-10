import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../services/categoryApi';
import { Category } from '../../types/category';

const AdminCourseCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        slug: category.slug || '',
        is_active: category.is_active || true
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        slug: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      is_active: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Générer automatiquement le slug à partir du nom
      if (name === 'name') {
        const generatedSlug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        newData.slug = generatedSlug;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, {
          name: formData.name,
          description: formData.description,
          slug: formData.slug
        });
        toast.success("Catégorie mise à jour avec succès");
      } else {
        await categoryService.createCategory({
          name: formData.name,
          description: formData.description,
          slug: formData.slug
        });
        toast.success("Catégorie créée avec succès");
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Catégories des formations</h1>
          <Button onClick={() => handleOpenModal()} className="text-white">
            <Plus size={16} className="mr-2" />
            Nouvelle catégorie
          </Button>
        </div>

        {/* Liste des catégories */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Aucune catégorie trouvée
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{category.slug}</td>
                    <td className="px-6 py-4">{category.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(category)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal pour créer/éditer une catégorie */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out bg-white text-gray-900 placeholder-gray-400"
                    required
                    placeholder="Entrez le nom de la catégorie"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Le slug sera généré automatiquement"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Le slug sera généré automatiquement à partir du nom si non spécifié
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Entrez une description (optionnel)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="text-white">
                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseCategoriesPage; 