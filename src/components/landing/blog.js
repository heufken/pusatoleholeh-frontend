import React from "react";

const BlogCard = ({ title, content, imageUrl, reverse }) => {
  return (
    <div 
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="w-full md:w-1/3 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 md:h-full object-cover"
        />
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-indigo-100 text-[#4F46E5] text-sm font-medium rounded-full">Artikel</span>
            <span className="text-gray-500 text-sm">5 menit yang lalu</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 hover:text-[#4F46E5] transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {content}
          </p>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white font-medium">AM</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin Mbah Marto</p>
                <p className="text-sm text-gray-500">Content Writer</p>
              </div>
            </div>
            <button 
              className="inline-flex items-center space-x-2 text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
            >
              <span>Baca Selengkapnya</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const dummyBlogs = [
    {
      title: "Kerajinan Tangan Mbah Marto: Seni Tradisional Modern",
      content:
        "Mengenal lebih dekat kerajinan tangan khas Mbah Marto yang menggabungkan unsur tradisional dengan sentuhan modern. Setiap karya memiliki cerita unik yang menarik untuk ditelusuri.",
      imageUrl:
        "https://dummyimage.com/600x400/ddd/000.png&text=Image",
    },
    {
      title: "Tips Memilih Oleh-oleh Khas yang Berkualitas",
      content:
        "Panduan lengkap memilih oleh-oleh khas yang berkualitas. Dari makanan tradisional hingga kerajinan tangan, temukan tips berguna untuk mendapatkan oleh-oleh terbaik.",
      imageUrl:
        "https://dummyimage.com/600x400/ddd/000.png&text=Image",
    },
  ];

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Artikel Terbaru
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Temukan inspirasi dan wawasan menarik seputar dunia kerajinan tangan dan kuliner tradisional Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12">
          {dummyBlogs.map((blog, index) => (
            <BlogCard key={index} {...blog} reverse={index % 2 !== 0} />
          ))}
        </div>

        <div className="text-center">
          <button 
            className="inline-flex items-center justify-center space-x-2 bg-white text-[#4F46E5] font-medium px-6 py-3 rounded-lg border border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/10"
          >
            <span>Lihat Semua Artikel</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
