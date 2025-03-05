import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Customer Care Section */}
                <div>
                    <h3 className="font-bold text-lg mb-4">CHĂM SÓC KHÁCH HÀNG</h3>
                    <ul className="space-y-2">
                        {["Trung Tâm Trợ Giúp", "Shopee Blog", "Shopee Mall", "Hướng Dẫn Mua Hàng", "Hướng Dẫn Bán Hàng", "Thanh Toán", "Shopee Xu", "Vận Chuyển", "Trả Hàng & Hoàn Tiền", "Chăm Sóc Khách Hàng", "Chính Sách Bảo Hành"].map((item, index) => (
                            <li key={index}>
                                <a href="#" className="text-gray-700 hover:text-gray-900" rel="noopener noreferrer">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment Section */}
                <div>
                    <h3 className="font-bold text-lg mb-4">THANH TOÁN</h3>
                    <ul className="flex flex-wrap gap-4">
                        {[
                            "https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8",
                            "https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16",
                            "https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08",
                            "https://down-vn.img.susercontent.com/file/bc2a874caeee705449c164be385b796c",
                            "https://down-vn.img.susercontent.com/file/2c46b83d84111ddc32cfd3b5995d9281",
                            "https://down-vn.img.susercontent.com/file/5e3f0bee86058637ff23cfdf2e14ca09",
                            "https://down-vn.img.susercontent.com/file/9263fa8c83628f5deff55e2a90758b06",
                            "https://down-vn.img.susercontent.com/file/0217f1d345587aa0a300e69e2195c492"
                        ].map((src, index) => (
                            <li key={index} className="w-16">
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <img src={src} alt="logo" className="w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Shipping Section */}
                <div>
                    <h3 className="font-bold text-lg mb-4">ĐƠN VỊ VẬN CHUYỂN</h3>
                    <ul className="flex flex-wrap gap-4">
                        {[
                            "https://down-vn.img.susercontent.com/file/vn-50009109-159200e3e365de418aae52b840f24185",
                            "https://down-vn.img.susercontent.com/file/d10b0ec09f0322f9201a4f3daf378ed2",
                            "https://down-vn.img.susercontent.com/file/vn-50009109-64f0b242486a67a3d29fd4bcf024a8c6",
                            "https://down-vn.img.susercontent.com/file/59270fb2f3fbb7cbc92fca3877edde3f",
                            "https://down-vn.img.susercontent.com/file/957f4eec32b963115f952835c779cd2c"
                        ].map((src, index) => (
                            <li key={index} className="w-16">
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <img src={src} alt="logo" className="w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Follow Us Section */}
                <div>
                    <h3 className="font-bold text-lg mb-4">THEO DÕI CHÚNG TÔI TRÊN</h3>
                    <ul className="space-y-2">
                        {[
                            { name: "Facebook", src: "https://down-vn.img.susercontent.com/file/2277b37437aa470fd1c71127c6ff8eb5" },
                            { name: "Instagram", src: "https://down-vn.img.susercontent.com/file/5973ebbc642ceee80a504a81203bfb91" },
                            { name: "LinkedIn", src: "https://down-vn.img.susercontent.com/file/f4f86f1119712b553992a75493065d9a" }
                        ].map((social, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <img src={social.src} alt={social.name} className="w-6 h-6" />
                                <a href="#" className="text-gray-700 hover:text-gray-900" rel="noopener noreferrer">
                                    {social.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-500">Copyright © 2024. All rights reserved by Bui Huu Danh.</p>
            </div>
        </footer>
    );
};

export default Footer;
