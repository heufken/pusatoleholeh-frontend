import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const { shopName } = useParams();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  // Fungsi untuk mengambil data toko
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${shopName}`);
        if (response.status === 200) {
          const shop = response.data.shop;
          setShopData(shop);

          // Memastikan `shopId` ada sebelum memuat produk terkait
          if (shop._id) {
            fetchProductsByShopId(shop._id);
          }
        } else {
          console.error('Shop not found');
          setShopData(null);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setShopData(null);
      }
    };

    // Fungsi untuk mengambil produk berdasarkan shopId
    const fetchProductsByShopId = async (shopId) => {
      try {
        const productResponse = await axios.get(`${apiUrl}/product/shop/${shopId}`);
        if (productResponse.status === 200) {
          console.log('Product Response:', productResponse); // Debugging respons produk
          const productsData = productResponse.data || [];
          setProducts(productsData.map(product => {
            // Menentukan URL gambar cover berdasarkan productId
            const productCover = product.coverImage?.url
              ? product.coverImage.url // Gambar cover menggunakan URL yang sudah ada
              : null;

            // Menyusun URL gambar produk dengan menggunakan URL yang ada di productImages
            const productImages = product.productImages.map(image => {
              return image.url
                ? image.url // Menggunakan URL gambar produk yang sudah ada
                : null;
            });

            return {
              ...product,
              productCover,
              productImages
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchShopData();
  }, [shopName, apiUrl, cdnUrl]);

  // Fungsi untuk mengarahkan ke halaman detail produk
  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

  // Menampilkan loading jika data toko belum ada
  if (!shopData) {
    return <p>Loading shop data...</p>;
  }

  // Menangani data alamat toko
  const address = shopData.address || {};

  return (
    <div>
      <h1>{shopData.name}</h1>
      <p>Description: {shopData.description}</p>
      <p>City: {address.city || 'City not available'}</p>
      <p>District: {address.district || 'District not available'}</p>
      <p>Province: {address.province || 'Province not available'}</p>
      <p>Postal Code: {address.postalCode || 'Postal code not available'}</p>

      <h2>Products</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product._id} onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              <p>Stock: {product.stock}</p>
              {/* Menampilkan gambar cover produk jika ada */}
              {product.productCover ? (
                <img src={product.productCover} alt={product.name} style={{ width: '100px', height: '100px' }} />
              ) : (
                <p>No cover image available</p>
              )}
              {/* Menampilkan gambar produk jika ada */}
              {product.productImages.length > 0 ? (
                <div>
                  {product.productImages.map((image, index) => (
                    <img key={index} src={image} alt={`Product ${index + 1}`} style={{ width: '80px', height: '80px', marginRight: '5px' }} />
                  ))}
                </div>
              ) : (
                <p>No additional images available</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default Shop;
