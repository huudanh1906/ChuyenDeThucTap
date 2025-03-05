import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PageTopic = () => {
    const { slug } = useParams();
    const [topicPage, setTopicPage] = useState(null);

    useEffect(() => {
        const fetchPageTopic = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/trang-don/${slug}`);
                setTopicPage(response.data);
            } catch (error) {
                console.error("Error fetching the topic page data", error);
            }
        };
        fetchPageTopic();
    }, [slug]);

    if (!topicPage) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-2xl font-bold text-center p-4">{topicPage.title}</h2>
                <img
                    src={`http://localhost:8000/imgs/posts/${topicPage.image}`}
                    alt={topicPage.title}
                    className="w-full h-96 object-contain mx-auto rounded-lg"
                />
                <div className="p-6">
                    <h4 className="text-xl font-semibold mb-4">{topicPage.description}</h4>
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: topicPage.detail }}
                    ></div>
                    <p className="text-sm text-gray-500 mt-4">
                        Ngày đăng: {new Date(topicPage.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageTopic;
