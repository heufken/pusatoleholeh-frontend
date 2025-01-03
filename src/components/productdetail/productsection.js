import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faComment,
  faShareSquare,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { faTruckFast, faRotate } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

function ProductSection({ productData, onAddToCart, addToWishlist }) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= productData.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="product-section p-4 border-b border-gray-300">
      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #ffffff; /* Tailwind's red-400 */
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background-color: #ef4444; /* Tailwind's red-500 */
          }
        `}
      </style>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Slider */}
        <div className="w-full md:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
          >
            <SwiperSlide>
              <img
                src={productData.productCover}
                alt={productData.name}
                className="w-full h-auto rounded"
              />
            </SwiperSlide>
            {productData.productImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Product ${index}`}
                  className="w-full h-auto rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex md:w-1/5 pr-4 flex-col">
          {productData.productImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product ${index}`}
              className="mb-2 w-full h-auto rounded"
            />
          ))}
        </div>
        <div className="hidden md:block product-image w-full md:w-2/5">
          <img
            src={productData.productCover}
            alt={productData.name}
            className="w-full h-auto rounded"
          />
        </div>
        <div className="product-details w-full md:w-2/5 pl-4">
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          <div className="product-reviews text-yellow-500 mb-2">
            <span>⭐⭐⭐⭐☆</span>{" "}
            <span className="text-gray-600">
              ({productData.reviews} Reviews)
            </span>{" "}
            |{" "}
            <span
              className={`${
                productData.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {productData.stock > 0
                ? `In Stock (${productData.stock})`
                : "Out of Stock"}
            </span>
          </div>
          <div className="product-price text-xl font-semibold mb-4">
            Rp.{productData.price.toLocaleString()}
          </div>
          <h2 className="font-bold mb-2">Deskripsi</h2>
          <div className="product-description mb-4">
            <p>{productData.description}</p>
          </div>
          <hr className="mb-4 border-t border-gray-500" />
          <div className="purchase-options mb-4">
            <div className="quantity-selector flex items-center border border-gray-500 rounded mb-2 w-32">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-1 flex-1 hover:bg-red-500 hover:text-white"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-2 py-1 flex-1 text-center border-l border-r border-gray-500">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-1 flex-1 hover:bg-red-500 hover:text-white"
                disabled={quantity >= productData.stock}
              >
                +
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(quantity)}
                disabled={productData.stock === 0}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded
                  ${
                    productData.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } 
                  text-white font-semibold transition-colors`}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Add to Cart
              </button>

              <button className="buy-now bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600">
                Buy Now
              </button>

              <button
                onClick={addToWishlist}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
          <div className="flex justify-start text-gray-600 mb-4 space-x-4">
            <FontAwesomeIcon
              icon={liked ? faHeartSolid : faHeartRegular}
              style={{ color: liked ? "red" : "#000000" }}
              className="text-2xl cursor-pointer"
              onClick={toggleLike}
            />
            <FontAwesomeIcon
              icon={faComment}
              style={{ color: "#000000" }}
              className="text-2xl"
            />
            <FontAwesomeIcon
              icon={faShareSquare}
              style={{ color: "#000000" }}
              className="text-2xl"
            />
          </div>

          {/* Shop Info */}
          <div className="shop-info mb-4">
            <div className="border border-gray-500 p-4 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {productData.shopImage ? (
                      <img
                        src={productData.shopImage}
                        alt={productData.shopId.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl">
                        {productData.shopId.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">{productData.shopId.name}</h3>
                    <p className="text-sm text-gray-500">
                      {productData.shopId.address?.city ||
                        "Location not specified"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/shop/${productData.shopId.username}`)
                  }
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                >
                  Visit Store
                </button>
              </div>
            </div>
          </div>

          <div className="product-info pt-4">
            <div className="border border-gray-500 p-4 mb-2 rounded">
              <div className="delivery-info flex items-center mb-2">
                <FontAwesomeIcon
                  icon={faTruckFast}
                  style={{ color: "#000000" }}
                  className="text-3xl mr-2"
                />
                <div>
                  <p className="font-bold">Free Delivery</p>
                  <p>Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <hr className="my-2 border-t border-gray-500" />
              <div className="return-info flex items-center">
                <FontAwesomeIcon
                  icon={faRotate}
                  style={{ color: "#000000" }}
                  className="text-3xl mr-2"
                />
                <div>
                  <p className="font-bold">Return Delivery</p>
                  <p>Free 30 Days Delivery Returns. Details</p>
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
