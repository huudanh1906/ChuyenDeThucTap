import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './component/PostCard';
import { Link } from 'react-router-dom';

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPosts = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/bai-viet?page=${page}`);
            setPosts(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    return (
        <div className="container mx-auto my-5 p-5 rounded-lg bg-white shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-center">Bài viết</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Link to={`/chi-tiet-bai-viet/${post.slug}`} key={post.id}>
                        <PostCard post={post} />
                    </Link>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {pagination.links && pagination.links.map((link, index) => {
                    const cleanLabel = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                    return (
                        <button
                            key={index}
                            onClick={() => {
                                if (link.url) {
                                    if (cleanLabel === "Previous") {
                                        setCurrentPage(currentPage - 1);
                                    } else if (cleanLabel === "Next") {
                                        setCurrentPage(currentPage + 1);
                                    } else {
                                        setCurrentPage(parseInt(cleanLabel));
                                    }
                                }
                            }}
                            className={`mx-1 px-4 py-2 border rounded-md transition-colors ${link.active
                                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                                }`}
                            disabled={!link.url}
                        >
                            {cleanLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Post;
