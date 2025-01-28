import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon } from "@heroicons/react/24/outline";

const BlogCard = ({ blog, reverse }) => {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}>
      {/* Image Section */}
      <div className="w-full md:w-2/5 relative overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-0.5 text-xs font-medium text-white bg-black/30 rounded-full backdrop-blur-sm">
            {blog.category}
          </span>
        </div>
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-56 md:h-full object-cover transform scale-100 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center space-x-1.5 text-xs text-gray-600">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{blog.date}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4F46E5] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {blog.content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[1.5px]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">{blog.author.name}</p>
              <p className="text-xs text-gray-500">{blog.author.role}</p>
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
  const blogs = [
    {
      title: "Mengenal Lebih Dekat Kerajinan Tradisional Indonesia",
      content: "Eksplorasi mendalam tentang berbagai kerajinan tradisional dari berbagai daerah di Indonesia, teknik pembuatan, dan nilai budaya di baliknya. Temukan keunikan dan filosofi dari setiap karya seni yang dihasilkan.",
      imageUrl: "https://dummyimage.com/800x600/ddd/000.png&text=Blog+1",
      category: "Kerajinan",
      date: "12 Dec 2023",
      author: {
        name: "Sarah Wijaya",
        role: "Cultural Writer",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    },
    {
      title: "Rahasia di Balik Kelezatan Oleh-oleh Khas Daerah",
      content: "Mengungkap cerita menarik dan proses pembuatan di balik makanan-makanan khas daerah yang menjadi favorit untuk oleh-oleh. Dari bahan pilihan hingga teknik tradisional yang diwariskan turun-temurun.",
      imageUrl: "https://dummyimage.com/800x600/ddd/000.png&text=Blog+2",
      category: "Kuliner",
      date: "10 Dec 2023",
      author: {
        name: "Budi Santoso",
        role: "Food Expert",
        avatar: "https://i.pravatar.cc/150?img=2"
      }
    }
  ];

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
            {blogs.map((blog, index) => (
              <Link to="/article" key={index} className="block">
                <BlogCard blog={blog} reverse={index % 2 !== 0} />
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
