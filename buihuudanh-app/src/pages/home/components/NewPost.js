// NewPost.js
import React, { useEffect, useState } from 'react';
import PostCard from './PostCard'; // Import the PostCard component
import axios from 'axios';

const NewPost = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/bai-viet'); // Adjust the API endpoint as needed
                setPosts(response.data.data); // Access the 'data' property to get the array of posts
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto p-4 rounded-lg" style={{ width: '89%' }}>
            <h3 className="text-xl font-bold mb-4 text-center">Tin mới nhất</h3>
            <div className="flex flex-wrap justify-around">
                {Array.isArray(posts) && posts.map((postitem) => (
                    <PostCard key={postitem.slug} postitem={postitem} />
                ))}
            </div>
        </div>
    );
};

export default NewPost;
