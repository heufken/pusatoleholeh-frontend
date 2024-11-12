import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faComment, faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { faTruckFast, faRotate } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

function ProductSection({ productData }) {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
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
      <nav className="breadcrumbs text-sm mb-4 text-gray-600">
        <span>Account</span> / <span>Kue</span> / <span className="font-bold">{productData.name}</span>
      </nav>
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
              <img src={productData.productCover} alt={productData.name} className="w-full h-auto rounded" />
            </SwiperSlide>
            {productData.productImages.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`Product ${index}`} className="w-full h-auto rounded" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex md:w-1/5 pr-4 flex-col">
          {productData.productImages.map((img, index) => (
            <img key={index} src={img} alt={`Product ${index}`} className="mb-2 w-full h-auto rounded" />
          ))}
        </div>
        <div className="hidden md:block product-image w-full md:w-2/5">
          <img src={productData.productCover} alt={productData.name} className="w-full h-auto rounded" />
        </div>
        <div className="product-details w-full md:w-2/5 pl-4">
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          <div className="product-reviews text-yellow-500 mb-2">
            <span>⭐⭐⭐⭐☆</span> <span className="text-gray-600">({productData.reviews} Reviews)</span> | <span className="text-green-600">In Stock</span>
          </div>
          <div className="product-price text-xl font-semibold mb-4">Rp.{productData.price}</div>
          <h2 className="font-bold mb-2">Deskripsi</h2>
          <div className="product-description mb-4">
            <p>{productData.description}</p>
          </div>
          <hr className="mb-4 border-t border-gray-500" />
          <div className="purchase-options mb-4">
            <div className="quantity-selector flex items-center border border-gray-500 rounded mb-2 w-32">
              <button onClick={() => handleQuantityChange(-1)} className="p-1 flex-1 hover:bg-red-500 hover:text-white">-</button>
              <span className="px-2 py-1 flex-1 text-center border-l border-r border-gray-500">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="p-1 flex-1 hover:bg-red-500 hover:text-white">+</button>
            </div>
            <button className="buy-now bg-red-500 text-white rounded p-2 w-32 mt-2">Buy Now</button>
          </div>
          <div className="flex justify-start text-gray-600 mb-4 space-x-4">
            <FontAwesomeIcon
              icon={liked ? faHeartSolid : faHeartRegular}
              style={{ color: liked ? "red" : "#000000" }}
              className="text-2xl cursor-pointer"
              onClick={toggleLike}
            />
            <FontAwesomeIcon icon={faComment} style={{ color: "#000000" }} className="text-2xl" />
            <FontAwesomeIcon icon={faShareSquare} style={{ color: "#000000" }} className="text-2xl" />
          </div>
          <div className="product-info pt-4">
            <div className="border border-gray-500 p-4 mb-2 rounded">
              <div className="delivery-info flex items-center mb-2">
                <FontAwesomeIcon icon={faTruckFast} style={{ color: "#000000" }} className="text-3xl mr-2" />
                <div>
                  <p className="font-bold">Free Delivery</p>
                  <p>Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <hr className="my-2 border-t border-gray-500" />
              <div className="return-info flex items-center">
                <FontAwesomeIcon icon={faRotate} style={{ color: "#000000" }} className="text-3xl mr-2" />
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
