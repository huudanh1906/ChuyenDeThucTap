import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTrash = () => {
    const [deletedUsers, setDeletedUsers] = useState([]);

    // Fetch the list of deleted products from the server
    const fetchDeletedUsers = () => {
        axios.get('http://localhost:8000/admin/user/trash')
            .then(response => {
                console.log("Deleted Users Response:", response.data);
                setDeletedUsers(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error('Error fetching deleted users!', error);
            });
    };

    useEffect(() => {
        fetchDeletedUsers(); // Fetch Users on component mount
    }, []);

    // Restore User
    const restoreUser = (id) => {
        axios.get(`http://localhost:8000/admin/user/restore/${id}`)
            .then(() => {
                // Filter the user out of the list without re-fetching
                setDeletedUsers(deletedUsers.filter(user => user.id !== id));
            })
            .catch(error => {
                console.error('Error restoring user', error);
            });
    };

    // Permanently delete user and re-fetch the list
    const permanentlyDeleteUser = (id) => {
        axios.delete(`http://localhost:8000/admin/user/destroy/${id}`)
            .then(() => {
                // Re-fetch the deleted users list after permanent deletion
                fetchDeletedUsers();
            })
            .catch(error => {
                console.error('Error deleting user', error);
            });
    };

    return (
        <div className="container mx-60 p-6">
            <div className="flex justify-end mb-4">
                <a href="/admin/user" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Về Danh sách
                </a>
            </div>
            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Image</th>
                        <th className="px-4 py-2 text-left">User Name</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                        <th className="px-4 py-2 text-left">ID</th>
                    </tr>
                </thead>
                <tbody>
                    {deletedUsers.map((user, index) => (
                        <tr key={user.id} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2"><input type="checkbox" /></td>
                            <td className="px-4 py-2">
                                <img src={`http://localhost:8000/imgs/users/${user.image}`}
                                    alt={user.name}
                                    className="w-24 h-auto rounded"
                                />
                            </td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    onClick={() => restoreUser(user.id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition mr-2"
                                >
                                    <i className="fas fa-trash-restore-alt mr-1"></i>
                                    Restore
                                </button>
                                <button
                                    onClick={() => permanentlyDeleteUser(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                                >
                                    <i className="fas fa-trash mr-1"></i>
                                    Permanently delete
                                </button>
                            </td>
                            <td className="px-4 py-2">{user.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTrash;
