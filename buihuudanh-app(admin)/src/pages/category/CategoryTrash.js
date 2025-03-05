import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryTrash = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch the deleted categories
    axios.get('http://localhost:8000/admin/category/trash')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleRestore = (id) => {
    axios.get(`http://localhost:8000/admin/category/restore/${id}`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleDestroy = (id) => {
    axios.delete(`http://localhost:8000/admin/category/destroy/${id}`)
      .then(() => {
        setCategories(categories.filter(category => category.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mx-60 py-8">
      <div className="flex justify-end mb-4">
        <Link to="/admin/categories" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          <i className="fas fa-arrow-left mr-2"></i>Về Danh sách
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Hình</th>
              <th className="px-4 py-2">Tên danh mục</th>
              <th className="px-4 py-2">Hoạt động</th>
              <th className="px-4 py-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="bg-gray-100 border-b">
                <td className="px-4 py-2">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2">
                  <img src={`http://localhost:8000/imgs/categorys/${category.image}`} alt={category.name} className="w-12 h-12 object-cover" />
                </td>
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button onClick={() => handleRestore(category.id)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
                    <i className="fas fa-trash-restore-alt">Restore</i>
                  </button>
                  <Link to={`/admin/categories/show/${category.id}`} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
                    <i className="fas fa-eye">View</i>
                  </Link>
                  <button onClick={() => handleDestroy(category.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                    <i className="fas fa-trash">Permantly Delete</i>
                  </button>
                </td>
                <td className="px-4 py-2">{category.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTrash;
