import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from 'axios';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
      try {
        // Create URL object for parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
        
        // Get pathname from URL (part after host)
        const pathname = urlObj.pathname;
        
        // Combine with CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // If URL is invalid, try alternative method
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Remove protocol and host
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Ensure only one leading slash

        return `${cdnUrl}${cleanPath}`;
      }
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${apiUrl}/hero`);
        if (response.data.banners) {
          // Normalize URLs for all banners
          const normalizedBanners = response.data.banners.map(banner => ({
            ...banner,
            url: normalizeUrl(banner.url)
          }));
          setBanners(normalizedBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [apiUrl, normalizeUrl]);

  const slides = [
    {
      title: "Kerajinan Tangan Tradisional",
      subtitle: "Karya Terbaik dari Pengrajin Lokal",
      description: "Temukan koleksi kerajinan tangan berkualitas tinggi yang dibuat dengan cinta oleh para pengrajin lokal terbaik.",
      cta: "Jelajahi Koleksi",
    },
    {
      title: "Oleh-oleh Khas Daerah",
      subtitle: "Cita Rasa Nusantara",
      description: "Nikmati berbagai pilihan oleh-oleh khas dari berbagai daerah di Indonesia, langsung dari produsen terpercaya.",
      cta: "Lihat Produk",
    },
  ];

  if (loading) {
    return <div className="h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  return (
    <section id="hero" className="relative">
      <div className="relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="p-4 sm:p-6 lg:p-8">
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
                    className="h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
                  >
                    {banners.map((banner, index) => (
                      <SwiperSlide key={banner._id}>
                        <div className="relative h-full">
                          {/* Background Image with Gradient Overlay */}
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent z-10" />
                            <img
                              src={banner.url}
                              alt={`Hero Banner ${index + 1}`}
                              className="w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms] group-hover:scale-100"
                              
                            />
                          </div>

                          {/* Content */}
                          <div className="relative z-20 h-full flex items-center p-4 sm:p-8 md:p-12">
                            <div className="max-w-xs sm:max-w-lg md:max-w-2xl">
                              <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 mb-2 sm:mb-3 text-[10px] sm:text-xs md:text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
                                {slides[index % slides.length].subtitle}
                              </span>
                              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 md:mb-6 leading-tight">
                                {slides[index % slides.length].title}
                              </h1>
                              <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 md:mb-8 leading-relaxed line-clamp-2 sm:line-clamp-none">
                                {slides[index % slides.length].description}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <button className="group/btn inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white text-[#4F46E5] text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/5">
                                  <span className="mr-1.5 sm:mr-2">{slides[index % slides.length].cta}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-transparent border-2 border-white text-white text-sm sm:text-base font-medium rounded-lg hover:bg-white/10 transition-colors duration-300">
                                  Pelajari Lebih Lanjut
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Decorative Elements */}
                          <div className="absolute bottom-0 right-0 w-1/4 sm:w-1/3 h-full z-10 bg-gradient-to-l from-[#4F46E5]/10 to-transparent opacity-75" />
                          <div className="absolute top-1/4 right-1/4 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-[#7C3AED]/30 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
                          <div className="absolute bottom-1/4 right-1/3 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-[#4F46E5]/20 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000" />
                        </div>
                      </SwiperSlide>
                    ))}
                    
                    {/* Navigation Buttons */}
                    <div className="swiper-button-prev !hidden sm:!flex !text-white !w-8 sm:!w-12 !h-8 sm:!h-12 !bg-black/30 !rounded-full backdrop-blur-sm !left-2 sm:!left-4 hover:!bg-black/40 transition-all opacity-0 group-hover:opacity-100 after:!text-base sm:after:!text-lg">
                    </div>
                    <div className="swiper-button-next !hidden sm:!flex !text-white !w-8 sm:!w-12 !h-8 sm:!h-12 !bg-black/30 !rounded-full backdrop-blur-sm !right-2 sm:!right-4 hover:!bg-black/40 transition-all opacity-0 group-hover:opacity-100 after:!text-base sm:after:!text-lg">
                    </div>
                  </Swiper>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-6 sm:py-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6 md:gap-8 -mt-8 sm:-mt-16 relative z-30">
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
                      <div key={index} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {feature.icon}
                          </svg>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
