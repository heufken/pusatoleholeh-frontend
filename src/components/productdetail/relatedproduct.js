import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RelatedProduct({ categoryId, currentProductId }) {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback((url) => {
    if (!url) return null;
    const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;
    
    try {
      const urlObj = new URL(url.replace(/\\/g, "/"));
      const pathname = urlObj.pathname;
      return new URL(pathname, cdnUrl).toString();
    } catch (e) {
      const cleanPath = url
        .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '')
        .replace(/\\/g, "/")
        .replace(/^\/+/, '/');
      return `${cdnUrl}${cleanPath}`;
    }
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => 
      prev + 1 >= Math.ceil(relatedProducts.length / productsPerPage) ? 0 : prev + 1
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => 
      prev - 1 < 0 ? Math.ceil(relatedProducts.length / productsPerPage) - 1 : prev - 1
    );
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!categoryId) return;
        
        const response = await axios.get(`${apiUrl}/category/${categoryId}`);
        if (response.status === 200) {
          const filteredProducts = response.data.products
            .filter(product => product._id !== currentProductId)
            .slice(0, 8)
            .map(product => ({
              ...product,
              productCover: normalizeUrl(product.cover?.url)
            }));
            
          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [apiUrl, categoryId, currentProductId, normalizeUrl]);

  const displayedProducts = relatedProducts.slice(
    currentPage * productsPerPage,
    (currentPage * productsPerPage) + productsPerPage
  );

  return (
    <div className="related-product-section p-4 bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-1 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Produk Terkait</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
        </div>
        {relatedProducts.length > productsPerPage && (
          <div className="flex gap-2">
            <button 
              onClick={handlePrevPage}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md hover:bg-gray-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNextPage}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] shadow-md hover:opacity-90"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div 
              key={product._id} 
              className="product-card bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="relative">
                <img 
                  src={product.productCover} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-[#4F46E5] font-bold">Rp.{product.price.toLocaleString('id-ID')}</p>
            </div>
          ))
        ) : (
          <p>No related products available.</p>
        )}
      </div>
    </div>
  );
}

export default RelatedProduct;
