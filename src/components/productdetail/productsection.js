import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faComment,
  faShareSquare,
  faShoppingCart,
  faTruckFast,
  faRotate,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function ProductSection({ productData, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(productData.productCover);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!isAuthenticated || user?.role !== "buyer") return;
      
      try {
        const response = await axios.get(`${apiUrl}/wishlist/check/${productData._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLiked(response.data.isInWishlist);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    checkWishlist();
  }, [isAuthenticated, user, productData._id, token, apiUrl]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= productData.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= productData.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    if (user?.role !== "buyer") {
      toast.error("Hanya pembeli yang dapat menambahkan ke keranjang");
      return;
    }
    onAddToCart(quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    if (user?.role !== "buyer") {
      toast.error("Hanya pembeli yang dapat melakukan pembelian");
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (user?.role !== "buyer") {
      toast.error("Hanya pembeli yang dapat menambahkan ke wishlist");
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      console.log('Attempting wishlist operation with:', {
        productId: productData._id,
        token,
        isLiked: liked
      });

      if (liked) {
        const response = await axios.delete(`${baseUrl}/api/wishlist/${productData._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Wishlist remove response:', response.data);
        if (response.data.success) {
          setLiked(false);
          toast.success("Berhasil menghapus dari wishlist");
        }
      } else {
        const response = await axios.post(`${baseUrl}/api/wishlist/${productData._id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Wishlist add response:', response.data);
        if (response.data.success) {
          setLiked(true);
          toast.success("Berhasil menambahkan ke wishlist");
        }
      }
    } catch (error) {
      console.error('Wishlist operation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
        (liked ? "Gagal menghapus dari wishlist" : "Gagal menambahkan ke wishlist");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productData.name,
          text: productData.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link berhasil disalin ke clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Gagal membagikan produk");
    }
  };

  return (
    <div className="product-section p-4 border-b border-gray-300">
      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #ffffff;
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background-color: #ef4444;
          }
          .swiper-button-next,
          .swiper-button-prev {
            color: #ef4444;
          }
        `}
      </style>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Slider */}
        <div className="w-full md:hidden">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
          >
            <SwiperSlide>
              <img
                src={productData.productCover}
                alt={productData.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </SwiperSlide>
            {productData.productImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${productData.name} view ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex md:w-1/5 pr-4 flex-col gap-2">
          <img
            src={productData.productCover}
            alt={productData.name}
            className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${
              selectedImage === productData.productCover
                ? "border-2 border-red-500"
                : "border-2 border-transparent hover:border-gray-300"
            }`}
            onClick={() => setSelectedImage(productData.productCover)}
          />
          {productData.productImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${productData.name} view ${index + 1}`}
              className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${
                selectedImage === img
                  ? "border-2 border-red-500"
                  : "border-2 border-transparent hover:border-gray-300"
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className="hidden md:block w-full md:w-2/5">
          <img
            src={selectedImage}
            alt={productData.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="product-details w-full md:w-2/5 pl-4 mt-4 md:mt-0">
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          <div className="product-reviews flex items-center text-yellow-500 mb-2">
            <div className="flex items-center">
              <span className="mr-1">⭐</span>
              <span className="text-gray-700">
                {productData.rating || "4.5"} ({productData.reviews} Ulasan)
              </span>
            </div>
            <span className="mx-2">|</span>
            <span
              className={`${
                productData.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {productData.stock > 0
                ? `Stok ${productData.stock}`
                : "Stok Habis"}
            </span>
          </div>
          <div className="product-price text-2xl font-bold text-red-600 mb-4">
            Rp {productData.price.toLocaleString("id-ID")}
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">Deskripsi Produk</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {productData.description}
            </p>
          </div>

          <hr className="my-6 border-gray-300" />

          {productData.stock > 0 && (
            <div className="purchase-options mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <div className="quantity-selector flex items-center border border-gray-300 rounded-lg mb-4 w-36 overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-full text-center border-x border-gray-300 py-1"
                  min="1"
                  max={productData.stock}
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= productData.stock}
                >
                  +
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={productData.stock === 0}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Tambah ke Keranjang</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={productData.stock === 0}
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-start space-x-6 mb-6">
            <button
              onClick={handleWishlist}
              className="flex items-center text-gray-700 hover:text-red-500 transition-colors"
            >
              <FontAwesomeIcon
                icon={liked ? faHeartSolid : faHeartRegular}
                className={`text-xl ${liked ? "text-red-500" : ""}`}
              />
              <span className="ml-2 text-sm">Wishlist</span>
            </button>
            <button
              onClick={() => navigate(`/product/${productData._id}#discussion`)}
              className="flex items-center text-gray-700 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faComment} className="text-xl" />
              <span className="ml-2 text-sm">Diskusi</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center text-gray-700 hover:text-green-500 transition-colors"
            >
              <FontAwesomeIcon icon={faShareSquare} className="text-xl" />
              <span className="ml-2 text-sm">Bagikan</span>
            </button>
          </div>

          {/* Shop Info */}
          <div className="shop-info mb-6">
            <div className="border border-gray-300 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white">
                    {productData.shopImage ? (
                      <img
                        src={productData.shopImage}
                        alt={productData.shopId.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {productData.shopId.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-900">
                      {productData.shopId.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                      <span>
                        {productData.shopId.address?.city ||
                          "Lokasi tidak tersedia"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/shop/${productData.shopId.username}`)}
                  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-medium"
                >
                  Kunjungi Toko
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="border border-gray-300 rounded-lg divide-y divide-gray-300">
              <div className="p-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    className="text-2xl text-red-500 mr-3"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Pengiriman Gratis</p>
                    <p className="text-sm text-gray-600">
                      Masukkan kode pos Anda untuk cek ketersediaan
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faRotate}
                    className="text-2xl text-red-500 mr-3"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Pengembalian Gratis</p>
                    <p className="text-sm text-gray-600">
                      30 Hari Garansi Pengembalian
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;
