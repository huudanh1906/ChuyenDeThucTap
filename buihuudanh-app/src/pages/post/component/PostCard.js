// PostCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="card text-start w-full h-64 p-2 shadow-lg">
            <Link to={`/chi-tiet-bai-viet/${post.slug}`}>
                <img
                    className="card-img-top h-40 w-full object-cover rounded-lg mb-2"
                    src={`http://localhost:8000/imgs/posts/${post.image}`}
                    alt={post.title}
                />
                <div className="card-body">
                    <p className="card-text text-lg font-semibold">{post.title}</p>
                </div>
            </Link>
        </div>
    );
};

export default PostCard;
