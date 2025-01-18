import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/section/header";
import { ThreeDots } from "react-loader-spinner"; 

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

  return (
    <>
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
                const shopName = result.shopName || result.name || "Nama toko tidak tersedia";
                const shopDescription =
                  result.shopDescription || result.description || "Deskripsi tidak tersedia";
                const linkTo =
                  searchType === "shop"
                    ? `/shop/${result.shopName || result.username}`
                    : `/product/${result._id}`;

                return (
                  <Link
                    to={linkTo}
                    key={index}
                    className="border p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 block hover:border-[#4F46E5]"
                  >
                    <div className="relative">
                      {searchType === "product" && result.productCover && (
                        <img
                          src={normalizeUrl(result.productCover)}
                          alt={result.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-xl text-gray-800 mb-2 hover:text-[#4F46E5]">
                          {searchType === "shop" ? shopName : result.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {searchType === "shop" ? shopDescription : result.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-lg col-span-full">
                Tidak ada hasil ditemukan.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
