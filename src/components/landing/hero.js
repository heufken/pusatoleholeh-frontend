import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = () => {
  const slides = [
    {
      title: "Kerajinan Tangan Tradisional",
      subtitle: "Karya Terbaik dari Pengrajin Lokal",
      description: "Temukan koleksi kerajinan tangan berkualitas tinggi yang dibuat dengan cinta oleh para pengrajin lokal terbaik.",
      image: "https://dummyimage.com/1200x600/ddd/000.png&text=Slide+1",
      cta: "Jelajahi Koleksi",
    },
    {
      title: "Oleh-oleh Khas Daerah",
      subtitle: "Cita Rasa Nusantara",
      description: "Nikmati berbagai pilihan oleh-oleh khas dari berbagai daerah di Indonesia, langsung dari produsen terpercaya.",
      image: "https://dummyimage.com/1200x600/ddd/000.png&text=Slide+2",
      cta: "Lihat Produk",
    },
  ];

  return (
    <section id="hero" className="relative bg-gray-50">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50 z-10" />
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl">
                  <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex space-x-4">
                    <button className="px-8 py-3 bg-white text-[#4F46E5] font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg shadow-black/5">
                      {slide.cta}
                    </button>
                    <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300">
                      Pelajari Lebih Lanjut
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-1/3 h-full z-10 bg-gradient-to-l from-[#4F46E5]/10 to-transparent" />
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-[#4F46E5]/20 rounded-full blur-2xl" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-16 relative z-30">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Kualitas Terjamin</h3>
            <p className="text-gray-600">Produk terbaik dari pengrajin terseleksi dengan standar kualitas tinggi</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pengiriman Cepat</h3>
            <p className="text-gray-600">Layanan pengiriman cepat ke seluruh Indonesia dengan packaging aman</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pembayaran Aman</h3>
            <p className="text-gray-600">Berbagai metode pembayaran yang aman dan terpercaya</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
