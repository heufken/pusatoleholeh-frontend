import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../components/context/AuthContext";
import Header from "../components/section/header";
import Footer from "../components/section/footer";
import { ThreeDots } from "react-loader-spinner";
import { StarIcon, HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

const normalizeUrl = (url) => {
  if (!url) return null;
  const cleanedPath = url
    .replace(/^.*localhost:\d+\//, "/")
    .replace(/\\/g, "/");
  return `${cdnUrl}${cleanedPath}`
    .replace(/\/\//g, "/")
    .replace(":/", "://");
};

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const query = new URLSearchParams(location.search).get("q") || "";
  const searchType = new URLSearchParams(location.search).get("st") || "product";

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { st: searchType, q: query },
      });
      setResults(response.data.results || []);
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchType]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleSearchTypeChange = (type) => {
    navigate(`/search?st=${type}&q=${encodeURIComponent(query)}`);
  };

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
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

  const handleProductClick = (e, productId) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Hasil Pencarian untuk "{query}"
        </h2>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => handleSearchTypeChange("product")}
            className={`px-6 py-2 rounded-l-lg text-sm font-semibold transition-colors duration-200 border ${
              searchType === "product"
                ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => handleSearchTypeChange("shop")}
            className={`px-6 py-2 rounded-r-lg text-sm font-semibold transition-colors duration-200 border ${
              searchType === "shop"
                ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Toko
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-10">
            <ThreeDots
              height="50"
              width="50"
              color="#4F46E5"
              ariaLabel="three-dots-loading"
              visible={true}
            />
            <span className="ml-4 text-lg font-medium text-gray-500">
              Loading...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.length > 0 ? (
              results.map((result, index) => {
                if (searchType === "shop") {
                  return (
                    <Link
                      to={`/shop/${result.shopName || result.username}`}
                      key={result._id}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-xl text-gray-800 mb-2 hover:text-[#4F46E5]">
                          {result.name || "Nama toko tidak tersedia"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {result.description || "Deskripsi tidak tersedia"}
                        </p>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <div
                      key={result._id}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative">
                        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl">
                          <img
                            src={normalizeUrl(result.productCover) || '/placeholder-product.jpg'}
                            alt={result.name}
                            className="w-full h-64 object-cover object-center rounded-t-2xl"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-product.jpg';
                            }}
                            onClick={(e) => handleProductClick(e, result._id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          <button 
                            onClick={(e) => handleAddToWishlist(e, result._id)}
                            className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg"
                          >
                            <HeartIcon className="h-5 w-5 text-gray-600" />
                          </button>
                          <button 
                            onClick={(e) => handleProductClick(e, result._id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                          >
                            <ShoppingCartIcon className="h-5 w-5" />
                            Beli
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {result.discount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg shadow-lg">
                              {result.discount}% OFF
                            </span>
                          )}
                          {result.isNew && (
                            <span className="px-2 py-1 text-xs font-medium text-white bg-[#4F46E5] rounded-lg shadow-lg">
                              New
                            </span>
                          )}
                          {result.stock <= 5 && (
                            <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg shadow-lg">
                              Stok Terbatas
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-500">{result.categoryId?.name || "Uncategorized"}</p>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              Rp {result.price?.toLocaleString()}
                            </p>
                            {result.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">
                                Rp {result.originalPrice?.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <StarIcon className={`h-4 w-4 ${result.averageRating > 0 ? 'text-yellow-400' : 'text-gray-300'}`} />
                            <span className="text-sm text-gray-600">
                              {result.averageRating > 0 ? result.averageRating.toFixed(1) : 'N/A'}
                            </span>
                            {result.totalReviews > 0 && (
                              <span className="text-sm text-gray-400">({result.totalReviews})</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <p className="text-center text-gray-500 text-lg col-span-full">
                Tidak ada hasil ditemukan.
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
