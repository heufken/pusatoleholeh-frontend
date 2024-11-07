import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams(); // Ambil productId dari URL
  const [productData, setProductData] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/product/${productId}`);
        if (response.status === 200) {
          const { product, coverImage, productImages } = response.data;

          // Fungsi untuk mengonversi URL gambar
          const normalizeUrl = (url) => {
            if (!url) return null;
            const formattedUrl = `${cdnUrl}${url.replace(/\\/g, "/").replace(/^.*localhost:\d+\//, "/")}`;
            return formattedUrl.startsWith("http") ? formattedUrl : `${cdnUrl}${formattedUrl}`;
          };

          // Perbarui URL gambar untuk cover dan images
          const formattedProduct = {
            ...product,
            productCover: normalizeUrl(coverImage),
            productImages: (productImages || []).map(img => normalizeUrl(img.url)),
          };

          // Log data untuk debugging
          console.log("Formatted Product Data:", formattedProduct);
          console.log("Product Cover URL:", formattedProduct.productCover);
          console.log("Product Images URLs:", formattedProduct.productImages);

          setProductData(formattedProduct);
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
  }, [productId, apiUrl, cdnUrl]);

  if (!productData) {
    return <p>Loading product data...</p>;
  }

  return (
    <div>
      <h1>{productData.name}</h1>
      <p>Description: {productData.description}</p>
      <p>Price: ${productData.price}</p>
      <p>Stock: {productData.stock}</p>

      {/* Menampilkan cover produk jika ada */}
      {productData.productCover ? (
        <div>
          <h2>Product Cover</h2>
          <img
            src={productData.productCover}
            alt={`${productData.name} cover`}
            style={{ width: '300px', height: 'auto', marginBottom: '20px' }}
          />
        </div>
      ) : (
        <p>No cover image available</p>
      )}

      {/* Menampilkan gambar produk lainnya jika ada */}
      {productData.productImages && productData.productImages.length > 0 ? (
        <div>
          <h2>Product Images</h2>
          <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0 }}>
            {productData.productImages.map((image, index) => (
              <li key={index}>
                <img
                  src={image}
                  alt={`${productData.name} ${index + 1}`}
                  style={{ width: '200px', height: 'auto' }}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No additional images available</p>
      )}
    </div>
  );
};

export default ProductDetail;
