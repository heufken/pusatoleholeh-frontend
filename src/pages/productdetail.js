import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams(); // Ambil productId dari URL
  const [productData, setProductData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/product/${productId}`);
        if (response.status === 200) {
          setProductData(response.data.product);
        } else {
          console.error('Product not found');
          setProductData(null);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setProductData(null);
      }
    };

    fetchProductData();
  }, [productId, apiUrl]);

  if (!productData) {
    return <p>Loading product data...</p>;
  }

  return (
    <div>
      <h1>{productData.name}</h1>
      <p>Description: {productData.description}</p>
      <p>Price: ${productData.price}</p>
      <p>Stock: {productData.stock}</p>
      {productData.images && productData.images.length > 0 && (
        <div>
          <h2>Product Images</h2>
          <ul>
            {productData.images.map((image) => (
              <li key={image._id}>
                <img src={image.url} alt={productData.name} style={{ width: '200px', height: 'auto' }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
