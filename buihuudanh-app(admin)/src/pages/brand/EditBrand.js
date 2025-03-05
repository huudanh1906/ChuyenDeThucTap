import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState({
    name: '',
    description: '',
    sort_order: 0,
    image: null,
    status: 1,
  });
  const [sortOptions, setSortOptions] = useState([]);

  useEffect(() => {
    const fetchBrand = async () => {
      const response = await axios.get(`http://localhost:8000/admin/brand/show/${id}`);
      setBrand(response.data);
    };

    const fetchSortOptions = async () => {
      const response = await axios.get(`http://localhost:8000/admin/brand`);
      setSortOptions(response.data);
    };

    fetchBrand();
    fetchSortOptions();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBrand({ ...brand, image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: brand.name,
      description: brand.description,
      sort_order: brand.sort_order,
      status: brand.status,
      image: brand.image,
    };

    await axios.put(`http://localhost:8000/admin/brand/update/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate('/admin/brands');
  };

  return (
    <div className="container mx-60 p-4">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa thương hiệu</h1>
      <div className="bg-white shadow-md rounded p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Tên thương hiệu</label>
            <input
              type="text"
              name="name"
              id="name"
              value={brand.name}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">Mô tả</label>
            <textarea
              name="description"
              id="description"
              value={brand.description}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="sort_order">Sắp xếp</label>
            <select
              name="sort_order"
              id="sort_order"
              value={brand.sort_order}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="0">none</option>
              {sortOptions.map(option => (
                <option key={option.id} value={option.id + 1}>
                  Sau: {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="image">Hình</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="status">Trạng thái</label>
            <select
              name="status"
              id="status"
              value={brand.status}
              onChange={handleChange}
              className="border border-gray-300 rounded w-full p-2"
            >
              <option value="1">Xuất bản</option>
              <option value="2">Chưa xuất bản</option>
            </select>
          </div>

          <div className="mb-4">
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
              Sửa thương hiệu
            </button>
            <button
              type="button"
              className="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
              onClick={() => navigate('/admin/brands')}
            >
              Về Danh sách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;
