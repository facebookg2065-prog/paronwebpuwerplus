import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { Edit, Trash2, Plus, X, Save, Image as ImageIcon } from 'lucide-react';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: Date.now(), // Mock ID
      name: '',
      price: 0,
      category: '',
      image: 'https://picsum.photos/id/10/600/400',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Check if updating existing or adding new
    const existingIndex = products.findIndex(p => p.id === editingProduct.id);
    
    if (existingIndex >= 0) {
      // Update
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = editingProduct as Product;
      setProducts(updatedProducts);
    } else {
      // Add new
      setProducts([editingProduct as Product, ...products]);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setEditingProduct(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
        <button 
          onClick={handleAddNew}
          className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-lg shadow-green-900/20"
        >
          <Plus size={20} /> إضافة إعلان جديد
        </button>
      </div>

      <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-dark/50 border-b border-gray-800 text-gray-400">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">الصورة</th>
                <th className="p-4 font-medium">اسم السلاح</th>
                <th className="p-4 font-medium">السعر</th>
                <th className="p-4 font-medium">التصنيف</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 text-gray-500 font-mono text-sm">{product.id}</td>
                  <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-16 h-12 object-cover rounded border border-gray-700" />
                  </td>
                  <td className="p-4 font-bold text-white">{product.name}</td>
                  <td className="p-4 text-primary font-bold">${product.price}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">{product.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-600/30"
                        title="تعديل"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-600/30"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl p-6 animate-fade-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              {editingProduct.id && products.some(p => p.id === editingProduct.id) ? <Edit className="text-primary" /> : <Plus className="text-green-500" />}
              {editingProduct.id && products.some(p => p.id === editingProduct.id) ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">السعر ($)</label>
                  <input 
                    type="number" 
                    value={editingProduct.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">التصنيف</label>
                    <select 
                        value={editingProduct.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                    >
                        <option value="Rifle">Rifle</option>
                        <option value="Pistol">Pistol</option>
                        <option value="Shotgun">Shotgun</option>
                        <option value="Sniper">Sniper</option>
                        <option value="Gear">Gear</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">الوصف</label>
                <textarea 
                  value={editingProduct.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-dark border border-gray-700 rounded-lg p-2 text-white focus:border-primary focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-3 bg-dark/50 rounded-lg border border-gray-800 text-sm text-gray-400">
                <ImageIcon size={16} />
                <span>سيتم استخدام صورة افتراضية لهذا العرض التجريبي</span>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4">
                <Save size={18} /> حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;