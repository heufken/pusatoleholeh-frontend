import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/section/header";
import ProductSection from "../components/productdetail/productsection";
import RelatedProduct from "../components/productdetail/relatedproduct";
import ReviewsProduct from "../components/productdetail/reviewsproduct";
import Footer from '../components/section/footer';
import { ThreeDots } from "react-loader-spinner"; // Import spinner loader

const ProductDetail = () => {
  const { productId } = useParams(); 
  const [productData, setProductData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Track loading state
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
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched or failed
      }
    };

    fetchProductData();
  }, [productId, apiUrl, cdnUrl]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots
          height="50"
          width="50"
          color="#F87171" // You can customize the color here
          ariaLabel="three-dots-loading"
          visible={true}
        />
        <span className="ml-4 text-lg font-medium text-gray-500">
          Loading product data...
        </span>
      </div>
    );
  }

  if (!productData) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <Header />
      <ProductSection productData={productData} />
      <RelatedProduct />
      <ReviewsProduct />
      <Footer />
    </div>
  );
};

export default ProductDetail;
