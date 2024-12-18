import React from "react";
import { Link } from "react-router-dom";
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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{
              clickable: true,
              renderBullet: function (index, className) {
                return '<span class="' + className + ' bg-white"></span>';
              },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="h-[500px] rounded-2xl overflow-hidden"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full">
                  {/* Background Image with Gradient Overlay */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent z-10" />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms] group-hover:scale-100"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-20 h-full flex items-center p-12">
                    <div className="max-w-2xl">
                      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex space-x-4">
                        <button className="group/btn inline-flex items-center px-8 py-3 bg-white text-[#4F46E5] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/5">
                          <span className="mr-2">{slide.cta}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300">
                          Pelajari Lebih Lanjut
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-1/3 h-full z-10 bg-gradient-to-l from-[#4F46E5]/10 to-transparent opacity-75" />
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#7C3AED]/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-[#4F46E5]/20 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>
              </SwiperSlide>
            ))}
            
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/30 !rounded-full backdrop-blur-sm !left-4 hover:!bg-black/40 transition-all opacity-0 group-hover:opacity-100 after:!text-lg">
            </div>
            <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/30 !rounded-full backdrop-blur-sm !right-4 hover:!bg-black/40 transition-all opacity-0 group-hover:opacity-100 after:!text-lg">
            </div>
          </Swiper>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-16 relative z-30">
            {[
              {
                title: "Kualitas Terjamin",
                description: "Produk terbaik dari pengrajin terseleksi dengan standar kualitas tinggi",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                )
              },
              {
                title: "Pengiriman Cepat",
                description: "Layanan pengiriman cepat ke seluruh Indonesia",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )
              },
              {
                title: "Pembayaran Aman",
                description: "Transaksi aman dengan berbagai metode pembayaran",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                )
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
