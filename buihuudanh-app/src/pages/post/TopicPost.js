// Post.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './component/PostCard';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const TopicPost = () => {
    const { slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPosts = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/chu-de/${slug}?page=${page}`); // Fetch posts for the specific page
            setPosts(response.data.data); // Update posts
            setPagination(response.data); // Capture pagination info
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]); // Fetch posts whenever the current page changes

    return (
        <div className="container mx-auto my-5 p-5 rounded-lg bg-white shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-center">Bài viết</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {pagination.links && pagination.links.map((link, index) => {
                    // Clean the label by removing HTML entities
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
                                        setCurrentPage(parseInt(cleanLabel)); // For numeric page links
                                    }
                                }
                            }}
                            className={`mx-1 px-4 py-2 border rounded-md transition-colors ${link.active
                                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                                }`}
                            disabled={!link.url} // Disable button if no URL
                        >
                            {cleanLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TopicPost;