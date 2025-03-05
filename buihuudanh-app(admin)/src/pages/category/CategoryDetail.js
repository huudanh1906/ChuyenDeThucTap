import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryDetail = () => {
  const { id } = useParams(); // Get the category ID from URL params
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Fetch category details by ID
    axios.get(`http://localhost:8000/admin/category/show/${id}`)
      .then((response) => setCategory(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-60 py-8 px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Tên danh mục: {category.name}</h2>
        <Link to="/admin/categories" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          <i className="fas fa-arrow-left mr-2"></i>Về Danh sách
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex">
          <div className="w-1/4">
            <img src={`http://localhost:8000/imgs/categorys/${category.image}`} alt={category.name} className="w-32 h-32 object-cover" />
          </div>
          <div className="w-3/4 ml-4">
            <p className="text-lg">ID: {category.id}</p>
            <p className="text-lg">Miêu tả: {category.description}</p>
            <p className="text-lg">Created At: {new Date(category.created_at).toLocaleString()}</p>
            <p className="text-lg">Updated At: {new Date(category.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
