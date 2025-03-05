import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BrandTrash = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admin/brand/trash');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  const handleRestore = async (id) => {
    try {
      await axios.get(`http://localhost:8000/admin/brand/restore/${id}`);
      setBrands(brands.filter(brand => brand.id !== id));
    } catch (error) {
      console.error('Error restoring brand:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this brand?')) {
      try {
        await axios.get(`http://localhost:8000/admin/brand/destroy/${id}`);
        setBrands(brands.filter(brand => brand.id !== id));
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  return (
    <div className="container mx-60 p-6">
      <div className="mb-4 text-right">
        <Link to="/admin/brands" className="bg-green-500 text-white px-4 py-2 rounded">
          <i className="fas fa-arrow-left mr-2"></i>Về Danh sách
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Hình</th>
              <th className="px-4 py-2 border-b">Tên danh mục</th>
              <th className="px-4 py-2 border-b text-center">Hoạt động</th>
              <th className="px-4 py-2 border-b">ID</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand.id}>
                <td className="px-4 py-2 border-b">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2 border-b">
                  <img src={`http://localhost:8000/imgs/brands/${brand.image}`} alt={brand.name} className="w-12" />
                </td>
                <td className="px-4 py-2 border-b">{brand.name}</td>
                <td className="px-4 py-2 border-b text-center">
                  <button onClick={() => handleRestore(brand.id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    <i className="fas fa-trash-restore-alt">Restore</i>
                  </button>
                  <Link to={`/admin/brands/show/${brand.id}`} className="bg-green-500 text-white px-2 py-1 rounded mx-1">
                    <i className="fas fa-eye">View</i>
                  </Link>
                  <button onClick={() => handleDelete(brand.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    <i className="fas fa-trash">Permantly Delete</i>
                  </button>
                </td>
                <td className="px-4 py-2 border-b">{brand.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandTrash;
