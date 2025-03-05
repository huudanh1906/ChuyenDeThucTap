import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/admin/user/show/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-60 p-4">
      <div className="card bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="card-header flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Tên người dùng: {user.name}</h2>
          <Link to="/admin/user" className="btn bg-green-500 text-white px-4 py-2 rounded">
            <i className="fas fa-arrow-left mr-2"></i>Về Danh sách
          </Link>
        </div>
        <div className="flex m-4">
          <div className="w-1/3">
            <img 
              src={`http://localhost:8000/imgs/users/${user.image}`} 
              alt={user.name} 
              className="img-fluid w-36 h-36 object-cover rounded-full"
            />
          </div>
          <div className="w-2/3 pl-4">
            <p>ID: {user.id}</p>
            <p>Tên: {user.name}</p>
            <p>Tên đăng nhập: {user.username}</p>
            <p>Giới tính: {user.gender === '1' ? 'Nam' : 'Nữ'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
