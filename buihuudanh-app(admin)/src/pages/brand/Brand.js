import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sortOrder: 0,
    image: null,
    status: 1,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/brand");
      setBrands(response.data);
    } catch (err) {
      setError("Failed to fetch brands");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleStatusChange = async (brandId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 2 : 1; // Toggle status
      await axios.get(`http://localhost:8000/admin/brand/status/${brandId}`, { status: newStatus });
      fetchBrands(); // Refresh the brand list
    } catch (err) {
      setError("Failed to change brand status");
    }
  };

  const handleDelete = async (brandId) => {
    try {
      await axios.get(`http://localhost:8000/admin/brand/delete/${brandId}`);
      fetchBrands(); // Refresh the brand list after deletion
    } catch (err) {
      setError("Failed to delete brand");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("sort_order", form.sortOrder);
    formData.append("image", form.image);
    formData.append("status", form.status);

    try {
      await axios.post("http://localhost:8000/admin/brand/store", formData);
      fetchBrands(); // Refresh the brand list
    } catch (err) {
      setError("Failed to add brand");
    }
  };

  return (
    <div className="container mx-60 p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lí thương hiệu</h2>
      <div className="flex justify-end mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          <Link to="/admin/brands/trash" className="flex items-center justify-center h-full w-full">Trash</Link>
        </button>
      </div>

      {error && <div className="bg-red-200 p-4 mb-4">{error}</div>}

      <div className="grid grid-cols-3 gap-6">
        {/* Brand Form */}
        <div className="bg-gray-100 p-6 rounded shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="name">
                Tên thương hiệu
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="description">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="sortOrder">
                Sắp xếp
              </label>
              <select
                id="sortOrder"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              >
                <option value="0">None</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id + 1}>
                    Sau: {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="image">
                Hình
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="w-full p-2 mt-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="status">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              >
                <option value="1">Xuất bản</option>
                <option value="2">Chưa xuất bản</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Thêm thương hiệu
            </button>
          </form>
        </div>

        {/* Brand List */}
        <div className="col-span-2">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Hình</th>
                <th className="py-2 px-4 border">Tên thương hiệu</th>
                <th className="py-2 px-4 border">Hoạt động</th>
                <th className="py-2 px-4 border">ID</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="py-2 px-4 border">
                    <input type="checkbox" />
                  </td>
                  <td className="py-2 px-4 border">
                    <img
                      src={`http://localhost:8000/imgs/brands/${brand.image}`}
                      alt={brand.name}
                      className="w-12"
                    />
                  </td>
                  <td className="py-2 px-4 border">{brand.name}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => handleStatusChange(brand.id, brand.status)}
                      className={`text-white p-2 rounded ${brand.status === 1 ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {brand.status === 1 ? "Activate" : "Unactivate"}
                    </button>
                    <Link to={`/admin/brands/show/${brand.id}`} className="bg-blue-500 text-white p-2 rounded ml-2">
                      Xem
                    </Link>
                    <Link to={`/admin/brands/edit/${brand.id}`} className="bg-yellow-500 text-white p-2 rounded ml-2">
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="bg-red-500 text-white p-2 rounded ml-2"
                    >
                      Xóa
                    </button>
                  </td>
                  <td className="py-2 px-4 border">{brand.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Brands;
