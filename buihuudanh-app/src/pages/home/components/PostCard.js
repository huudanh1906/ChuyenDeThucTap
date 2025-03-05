// PostCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ postitem }) => {
    return (
        <div className="card text-start w-80 h-64 p-2 border rounded-lg shadow-lg">
            <Link to={`/chi-tiet-bai-viet/${postitem.slug}`}>
                <img
                    className="card-img-top h-44 object-cover rounded-md"
                    src={`http://localhost:8000/imgs/posts/${postitem.image}`} // Adjust the URL as needed
                    alt={postitem.title}
                />
                <div className="card-body">
                    <p className="card-text font-semibold">{postitem.title}</p>
                </div>
            </Link>
        </div>
    );
};

export default PostCard;
