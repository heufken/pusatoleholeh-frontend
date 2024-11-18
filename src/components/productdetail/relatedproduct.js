import React, { useEffect } from 'react';
// import axios from 'axios';

function RelatedProduct() {
  // const [relatedProducts, setRelatedProducts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // const fetchRelatedProducts = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/related-products`);
    //     if (response.status === 200) {
    //       setRelatedProducts(response.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching related products:', error);
    //   }
    // };

    // fetchRelatedProducts();
  }, [apiUrl]);

  return (
    <div className="related-product-section p-4 border-t border-gray-300">
      <div className="flex items-center mb-4">
        <div className="w-4 h-8 bg-red-500 rounded mr-2"></div>
        <h2 className="text-xl font-bold text-red-500">Related Products</h2>
      </div>
      <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <p>No related products available.</p>
      </div>
    </div>
  );
}

export default RelatedProduct;
