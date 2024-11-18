import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/productdetail/header";
import ProductSection from "../components/productdetail/productsection";
import RelatedProduct from "../components/productdetail/relatedproduct";
import ReviewsProduct from "../components/productdetail/reviewsproduct";

const ProductDetail = () => {
  const { productId } = useParams(); 
  const [productData, setProductData] = useState(null); 
  const apiUrl = process.env.REACT_APP_API_BASE_URL; 
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL; 

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/product/${productId}`);
        if (response.status === 200) {
          const { product, coverImage, productImages } = response.data;

          
          const normalizeUrl = (url) => {
            if (!url) return null;
            const formattedUrl = `${cdnUrl}${url.replace(/\\/g, "/").replace(/^.*localhost:\d+\//, "/")}`;
            return formattedUrl.startsWith("http") ? formattedUrl : `${cdnUrl}${formattedUrl}`;
          };

          
          const formattedProduct = {
            ...product,
            productCover: normalizeUrl(coverImage),
            productImages: (productImages || []).map(img => normalizeUrl(img.url)),
          };

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
      <Header />
      <ProductSection productData={productData} />
      <RelatedProduct />
      <ReviewsProduct />
    </div>
  );
};

export default ProductDetail;
