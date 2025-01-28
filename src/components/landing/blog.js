import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const BlogCard = ({ blog, reverse, normalizeUrl }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-[280px]`}>
      {/* Image Section */}
      <div className="w-full md:w-2/5 relative overflow-hidden h-[180px] md:h-full">
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-0.5 text-xs font-medium text-white bg-black/30 rounded-full backdrop-blur-sm">
            {blog.categoryId?.name || 'Uncategorized'}
          </span>
        </div>
        <img
          src={normalizeUrl(blog.cover?.url) || 'https://dummyimage.com/400x300/ddd/000.png&text=No+Image'}
          alt={blog.title}
          className="w-full h-full object-cover transform scale-100 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-1.5 text-xs text-gray-600">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(new Date(blog.createdAt), 'd MMM yyyy', { locale: id })}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4F46E5] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {blog.content}
          </p>
        </div>

        {/* Author Section - Made more compact */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[1px]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={blog.userId?.profileImage || 'https://i.pravatar.cc/100'}
                    alt={blog.userId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{blog.userId?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">Penulis</p>
            </div>
          </div>
          <div className="group/arrow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4F46E5] transform transition-transform duration-300 group-hover/arrow:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
      try {
        // Buat URL object untuk parsing
        const urlObj = new URL(url.replace(/\\/g, "/"));
        
        // Ambil pathname dari URL (bagian setelah host)
        const pathname = urlObj.pathname;
        
        // Gabungkan dengan CDN URL
        return new URL(pathname, cdnUrl).toString();
      } catch (e) {
        // Jika URL invalid, coba cara alternatif
        const cleanPath = url
          .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '') // Hapus protocol dan host
          .replace(/\\/g, "/")                         // Normalize slashes
          .replace(/^\/+/, '/');                       // Pastikan hanya ada satu leading slash

        return `${cdnUrl}${cleanPath}`;
      }
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/article/list`);
        // Sort by date and take latest 2
        const latestArticles = response.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);
        setArticles(latestArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [apiUrl]);

  if (error) {
    return null; // Hide section if error
  }

  if (isLoading) {
    return null; // Hide section while loading
  }

  if (articles.length === 0) {
    return null; // Hide section if no articles
  }

  return (
    <section id="blog" className="py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="p-4 sm:p-8 lg:p-12">
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 mb-2 sm:mb-3 text-xs font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
              Blog & Artikel
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Cerita Inspiratif</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Temukan inspirasi dan wawasan menarik seputar dunia kerajinan tangan dan kuliner tradisional Indonesia
            </p>
          </div>

          <div className="space-y-4 sm:space-y-8">
            {articles.map((article, index) => (
              <Link to={`/articleview/${article._id}`} key={article._id} className="block">
                <BlogCard 
                  blog={article} 
                  reverse={index % 2 !== 0} 
                  normalizeUrl={normalizeUrl}
                />
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link to="/articlehomepage" className="inline-flex items-center justify-center space-x-2 bg-white text-[#4F46E5] font-medium px-4 sm:px-6 py-2 rounded-lg border border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10 group">
              <span>Lihat Semua Artikel</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
