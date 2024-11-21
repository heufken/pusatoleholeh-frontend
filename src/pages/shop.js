import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/section/header";
import Footer from "../components/section/footer";
import { ThreeDots } from "react-loader-spinner";

const Shop = () => {
  const { shopName } = useParams();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopImage, setShopImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      const cleanedPath = url
        .replace(/^.*localhost:\d+\//, "/")
        .replace(/\\/g, "/");
      return `${cdnUrl}/${cleanedPath}`
        .replace(/\/\//g, "/")
        .replace(":/", "://");
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/shop/name/${shopName}`);
        if (response.status === 200) {
          const { shop, banner, image } = response.data;

          // const bannerUrl =
          //   banner.length > 0 ? normalizeUrl(banner[0].path) : null;
          // const imageUrl =
          //   image.length > 0 ? normalizeUrl(image[0].path) : null;

          setShopData(shop);
          setShopBanner(
            banner.length > 0 ? normalizeUrl(banner[0].path) : null
          );
          setShopImage(image.length > 0 ? normalizeUrl(image[0].path) : null);

          if (shop._id) {
            fetchProductsByShopId(shop._id);
          }
        } else {
          setShopData(null);
        }
      } catch (error) {
        setShopData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProductsByShopId = async (shopId) => {
      try {
        const productResponse = await axios.get(
          `${apiUrl}/product/shop/${shopId}`
        );
        if (productResponse.status === 200) {
          const productsData = productResponse.data || [];
          const formattedProducts = productsData.map((product) => {
            const productCover = normalizeUrl(product.productCover);

            return {
              ...product,
              productCover,
            };
          });

          setProducts(formattedProducts);
        }
      } catch (error) {}
    };

    fetchShopData();
  }, [normalizeUrl, apiUrl, shopName]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <ThreeDots
            height="50"
            width="50"
            color="#F87171"
            ariaLabel="three-dots-loading"
            visible={true}
          />
          <span className="ml-4 text-lg font-medium text-gray-500">
            Loading shop data...
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shopData) {
    return (
      <div>
        <Header />
        <p className="text-center text-gray-500 mt-8">Shop not found.</p>
        <Footer />
      </div>
    );
  }

  const address = shopData.address || {};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Shop Banner */}
          {shopBanner ? (
            <img
              src={shopBanner}
              alt={`${shopData.name} banner`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No Banner Available</p>
            </div>
          )}

          {/* Shop Details */}
          <div className="shop-details bg-white p-6 shadow-lg rounded-lg mb-6 flex items-center space-x-4">
            {shopImage ? (
              <img
                src={shopImage}
                alt={`${shopData.name} logo`}
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <p className="text-gray-500">No Logo</p>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">
                {shopData.name}
              </h1>
              <p className="text-gray-700 mb-4">{shopData.description}</p>
              <div className="address text-sm text-gray-600 space-y-1">
                <p>
                  <strong>City:</strong> {address.city || "City not available"}
                </p>
                <p>
                  <strong>District:</strong>{" "}
                  {address.district || "District not available"}
                </p>
                <p>
                  <strong>Province:</strong>{" "}
                  {address.province || "Province not available"}
                </p>
                <p>
                  <strong>Postal Code:</strong>{" "}
                  {address.postalCode || "Postal code not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="products">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="product-card bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl"
                  >
                    {product.productCover ? (
                      <img
                        src={product.productCover}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                        <p className="text-gray-500">No Image</p>
                      </div>
                    )}
                    <div className="product-info mt-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {product.description}
                      </p>
                      <p className="text-red-500 font-semibold">
                        Price: Rp. {product.price}
                      </p>
                      <p className="text-gray-700 text-sm">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No products available</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;
