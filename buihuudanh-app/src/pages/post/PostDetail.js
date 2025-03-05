import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        // Fetch the main post by slug
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/chi-tiet-bai-viet/${slug}`);
                setPost(response.data.post);
                setRelatedPosts(response.data.list_post.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [slug]);

    if (!post) return <div className="text-center mt-4">Loading...</div>;

    return (
        <div className="container mx-auto my-8">
            {/* Post Details */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <h2 className="text-2xl font-bold text-center mt-4 mb-2">{post.title}</h2>
                <img
                    src={`http://localhost:8000/imgs/posts/${post.image}`}
                    alt={post.title}
                    className="w-full h-80 object-contain"
                />
                <div className="p-6">
                    <h4 className="text-lg font-semibold mb-4">{post.description}</h4>
                    <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.detail }}></p>
                    <p className="text-gray-500 text-sm">Published on: {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center mb-4">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((postItem) => (
                        <div key={postItem.id} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
                            <img
                                src={`http://localhost:8000/imgs/posts/${postItem.image}`}
                                alt={postItem.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h4 className="text-lg font-semibold">{postItem.title}</h4>
                            <p className="text-gray-600 mt-2">{postItem.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
