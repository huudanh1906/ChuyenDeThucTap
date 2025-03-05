import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    axios.get('http://localhost:8000/admin/user')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  // Handle status toggle
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 2 : 1;
    axios.get(`http://localhost:8000/admin/user/status/${id}`)
      .then(() => {
        setUsers(users.map(user => 
          user.id === id ? { ...user, status: newStatus } : user
        ));
      })
      .catch(error => {
        console.error('There was an error updating the status!', error);
      });
  };

  // Handle delete
  const deleteUser = (id) => {
    axios.get(`http://localhost:8000/admin/user/delete/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  return (
    <div className="container mx-60 p-4">
      <div className="flex justify-end mb-4">
        <a href="/admin/user/trash" className="btn btn-success bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">
          <i className="fas fa-trash mr-2"></i>Thùng rác
        </a>
        <a href="/admin/user/create" className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 ml-4 rounded">
          <i className="fas fa-plus mr-2"></i>Thêm
        </a>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">#</th>
            <th className="py-2 px-4 border">Hình</th>
            <th className="py-2 px-4 border">Tên người dùng</th>
            <th className="py-2 px-4 border">Giới tính</th>
            <th className="py-2 px-4 border">Điện thoại</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Địa chỉ</th>
            <th className="py-2 px-4 border">Hoạt động</th>
            <th className="py-2 px-4 border">ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border"><input type="checkbox" /></td>
              <td className="py-2 px-4 border"><img src={`http://localhost:8000/imgs/users/${user.image}`} alt={user.image} className="w-12 h-12 object-cover" /></td>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.gender === '1' ? 'Nam' : 'Nữ'}</td>
              <td className="py-2 px-4 border">{user.phone}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.address}</td>
              <td className="py-2 px-4 border text-center">
                <button
                  onClick={() => toggleStatus(user.id, user.status)}
                  className={`px-3 py-2 rounded ${user.status === 1 ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white`}
                >
                  {user.status === 1 ? "Activate" : "Unactivate"}
                </button>
                <a href={`/admin/user/show/${user.id}`} className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded ml-2">
                  <i className="fas fa-eye">View</i>
                </a>
                <a href={`/admin/user/edit/${user.id}`} className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded ml-2">
                  <i className="fas fa-edit">Edit</i>
                </a>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded ml-2"
                >
                  <i className="fas fa-trash">Delete</i>
                </button>
              </td>
              <td className="py-2 px-4 border">{user.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
