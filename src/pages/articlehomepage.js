import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      try {
        const urlObj = new URL(url.replace(/\\/g, "/"));
        const pathname = urlObj.pathname;
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '')
          .replace(/\\/g, "/")
          .replace(/^\/+/, '/');
        return `${cdnUrl}${cleanPath}`;
      }
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/article/list`);
        if (response.data.success) {
          const allArticles = response.data.data;
          // Set featured articles (latest 3)
          setFeaturedArticles(allArticles.slice(0, 3));
          // Set remaining articles
          setArticles(allArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [apiUrl]);

  useEffect(() => {
    const fetchFilteredArticles = async () => {
      try {
        setIsLoading(true);
        let endpoint = `${apiUrl}/article/list`;
        
        if (activeFilter !== 'all') {
          endpoint = `${apiUrl}/article/category/${activeFilter}`;
        }
        
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setArticles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching filtered articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredArticles();
  }, [activeFilter, apiUrl]);

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5 font-sans">
      <Header />
      <Breadcrumb />
      
      {/* Hero Section with Swiper */}
      <div className="container mx-auto px-4 mb-12">
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Our Articles</h2>
          <p className="text-gray-600 text-lg max-w-2xl">Cari artikel tentang produk kesukaanmu dan temukan inspirasi baru setiap hari!</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="h-[600px] group"
          >
            {featuredArticles.map((article, index) => (
              <SwiperSlide key={article._id} onClick={() => navigate(`/articleview/${article._id}`)}>
                <div className="relative h-full cursor-pointer">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent z-10" />
                    <img
                      src={normalizeUrl(article.cover?.url) || 'https://dummyimage.com/1200x600/ddd/000.png&text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="relative z-20 h-full flex items-center p-12">
                    <div className="max-w-2xl">
                      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full">
                        {article.categoryId?.name}
                      </span>
                      <h1 className="text-6xl font-bold text-white mb-6">{article.title}</h1>
                      <p className="text-xl text-gray-200 mb-8">{article.content.substring(0, 150)}...</p>
                      <div className="flex items-center text-white/80 mb-8">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span>{format(new Date(article.createdAt), 'd MMMM yyyy', { locale: id })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative">
          <div className="flex flex-wrap gap-4 mb-8">
            <button 
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              Semua
            </button>
            {['6785f0775a994cdd532040ad', '6785f0775a994cdd532040ae', '6785f0775a994cdd532040af'].map((categoryId) => (
              <button 
                key={categoryId}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === categoryId 
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(categoryId)}
              >
                {categoryId === '6785f0775a994cdd532040ad' ? 'Makanan' :
                 categoryId === '6785f0775a994cdd532040ae' ? 'Minuman' :
                 'Kerajinan'}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-6 py-4 border border-gray-200 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5] mx-auto"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Tidak ada artikel yang ditemukan</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <Link to={`/articleview/${article._id}`} key={article._id}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={normalizeUrl(article.cover?.url) || 'https://dummyimage.com/400x300/ddd/000.png&text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 text-[#4F46E5] text-sm font-medium rounded-full">
                        {article.categoryId?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[2px]">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <img
                              src={article.userId?.profileImage || 'https://i.pravatar.cc/100'}
                              alt={article.userId?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{article.userId?.name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(article.createdAt), 'd MMM yyyy', { locale: id })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
