import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../components/context/AuthContext";
import Header from "../components/section/header";
import Footer from "../components/section/footer";
import { ThreeDots } from "react-loader-spinner";
import { StarIcon, HeartIcon, ShoppingCartIcon, MapPinIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const Shop = () => {
  const { shopName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [shopBanner, setShopBanner] = useState(null);
  const [shopImage, setShopImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("Semua Harga");
  const [sortBy, setSortBy] = useState("Terbaru");
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

    fetchShopData();
  }, [normalizeUrl, apiUrl, shopName]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`);
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const fetchProductsByShopId = async (shopId) => {
    try {
      const productResponse = await axios.get(
        `${apiUrl}/product/shop/${shopId}`
      );
      if (productResponse.status === 200) {
        const productsData = productResponse.data || [];
        const formattedProducts = productsData.map((product) => ({
          ...product,
          productCover: normalizeUrl(product.productCover),
          averageRating: product.reviews?.length > 0 
            ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
            : 0,
          totalReviews: product.reviews?.length || 0
        }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToWishlist = async (e, productId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Silakan login untuk menambahkan ke wishlist");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Produk berhasil ditambahkan ke wishlist!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan ke wishlist");
    }
  };

  // Filter and sort functions
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.categoryId?._id === selectedCategory);
    }

    // Apply price filter
    if (selectedPrice !== "Semua Harga") {
      switch (selectedPrice) {
        case "Dibawah Rp50.000":
          result = result.filter(product => product.price < 50000);
          break;
        case "Rp50.000 - Rp100.000":
          result = result.filter(product => product.price >= 50000 && product.price <= 100000);
          break;
        case "Diatas Rp100.000":
          result = result.filter(product => product.price > 100000);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "Harga: Rendah ke Tinggi":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Harga: Tinggi ke Rendah":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Rating Tertinggi":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "Terbaru":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedPrice, sortBy]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5">
      <Header />
      {/* Shop Banner and Info */}
      <div className="relative h-64 bg-white/10 backdrop-blur-sm">
        {shopBanner ? (
          <img
            src={shopBanner}
            alt={shopData?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600/50 to-purple-600/50 backdrop-blur-sm" />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
              {shopImage ? (
                <img
                  src={shopImage}
                  alt={shopData?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{shopData?.name}</h1>
              <p className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                {shopData?.address?.province || "Lokasi tidak tersedia"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                <option>Semua Harga</option>
                <option>Dibawah Rp50.000</option>
                <option>Rp50.000 - Rp100.000</option>
                <option>Diatas Rp100.000</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Terbaru</option>
              <option>Harga: Rendah ke Tinggi</option>
              <option>Harga: Tinggi ke Rendah</option>
              <option>Rating Tertinggi</option>
            </select>
            <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl">
                  <img
                    src={product.productCover || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center rounded-t-2xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-product.jpg';
                    }}
                    onClick={() => handleProductClick(product._id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Quick Action Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <button 
                    onClick={(e) => handleAddToWishlist(e, product._id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Beli
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg shadow-lg">
                      {product.discount}% OFF
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-[#4F46E5] rounded-lg shadow-lg">
                      New
                    </span>
                  )}
                  {product.stock <= 5 && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg shadow-lg">
                      Stok Terbatas
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {product.price?.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        Rp {product.originalPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className={`h-4 w-4 ${product.averageRating > 0 ? 'text-yellow-400' : 'text-gray-300'}`} />
                    <span className="text-sm text-gray-600">
                      {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'N/A'}
                    </span>
                    {product.totalReviews > 0 && (
                      <span className="text-sm text-gray-400">({product.totalReviews})</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
