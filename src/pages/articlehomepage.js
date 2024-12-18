import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { CalendarIcon } from '@heroicons/react/24/solid';

const Breadcrumb = () => {
  return (
    <nav className="container mx-auto px-4">
      <ul className="flex list-none p-0 my-4">
        <li className="mr-4">
          <Link to="/" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">Home</Link>
        </li>
        <li className="text-gray-500"> &gt; Article Home page</li>
      </ul>
    </nav>
  );
};

const ArticlePage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const slides = [
    {
      title: 'Pusat Oleh-Oleh Indonesia',
      subtitle: 'Cari Oleh-Oleh Kesukaan Anda!',
      description: 'Temukan berbagai macam oleh-oleh khas nusantara dengan kualitas terbaik.',
      image: 'swep1.jpg',
      date: '2022-01-01',
      tags: ['Kerajinan', 'Pahatan', 'Tangan'],
    },
    {
      title: 'Promo Menarik Menanti Anda',
      subtitle: 'Belanja mudah dan hemat!',
      description: 'Dapatkan penawaran spesial untuk berbagai produk pilihan.',
      image: 'swep2.jpg',
      date: '2022-02-01',
      tags: ['Promo', 'Diskon', 'Special'],
    },
    {
      title: 'Oleh-Oleh Khas Nusantara',
      subtitle: 'Temukan berbagai macam pilihan oleh-oleh!',
      description: 'Jelajahi ragam oleh-oleh dari berbagai daerah di Indonesia.',
      image: 'swep3.jpg',
      date: '2022-03-01',
      tags: ['Tradisional', 'Kuliner', 'Lokal'],
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-gray-50">
      <Header />
      <Breadcrumb />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Our Articles</h2>
          <p className="text-gray-600 text-lg max-w-2xl">Cari artikel tentang produk kesukaanmu dan temukan inspirasi baru setiap hari!</p>
          <div className="absolute -z-10 top-0 left-0 w-72 h-72 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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
            className="h-[600px] group"
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
                      <div className="flex flex-wrap gap-2 mb-8">
                        {slide.tags.map((tag, idx) => (
                          <span key={idx} className="px-4 py-2 bg-white/10 text-white text-sm rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-white/80 mb-8">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span>{new Date(slide.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <button className="group/btn inline-flex items-center px-8 py-3 bg-white text-[#4F46E5] font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/5">
                        <span className="mr-2">Read Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
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
            <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/30 !rounded-full !backdrop-blur-sm transition-all hover:!bg-black/50 opacity-0 group-hover:opacity-100"></div>
            <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/30 !rounded-full !backdrop-blur-sm transition-all hover:!bg-black/50 opacity-0 group-hover:opacity-100"></div>
          </Swiper>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {['all', 'makanan', 'snack', 'minuman', 'kerajinan', 'souvenir', 'lainnya'].map((filter) => (
              <button 
                key={filter}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30 scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center bg-gray-50 rounded-xl px-6 py-4 border border-gray-200 focus-within:border-[#4F46E5] transition-all shadow-sm hover:shadow-md">
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Lagi mau cari apa hari ini?"
                className="w-full bg-transparent border-none px-4 py-1 focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                <img
                  src={`produk ${index + 1}.jpg`.replace('.jpg', index > 3 ? (index === 5 ? '.webp' : '.jpg') : '.jpg')}
                  alt={`Article ${index + 1}`}
                  className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#4F46E5] text-sm font-medium rounded-full shadow-lg">
                    Artikel
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-500 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    5 menit yang lalu
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4F46E5] transition-colors">
                  {['Pusat Oleh-Oleh', 'Promo Menarik', 'Oleh-Oleh Khas', 'Dodol', 'Pai Sus', 'Emping'][index]}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10">
                      {/* Profile Image Container */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] animate-pulse"></div>
                      {index % 2 === 0 ? (
                        // With Profile Picture
                        <img 
                          src={`https://i.pravatar.cc/150?img=${index + 1}`} 
                          alt="Profile"
                          className="absolute inset-0.5 w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full object-cover"
                        />
                      ) : (
                        // Fallback with Initials
                        <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                          <span className="text-[#4F46E5] font-medium">AM</span>
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {index % 2 === 0 ? 'John Doe' : 'Admin Mbah'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {index % 2 === 0 ? 'Content Creator' : 'Writer'}
                      </p>
                    </div>
                  </div>
                  <button className="group/btn text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors inline-flex items-center">
                    <span className="mr-2">Read More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
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

export default ArticlePage;
