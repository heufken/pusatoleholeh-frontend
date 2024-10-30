import React from 'react';

const BlogCard = ({ title, content, imageUrl }) => (
  <div className="border bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
    <img src={imageUrl} alt={title} className="w-full md:w-1/3 h-48 object-cover" />
    <div className="p-4 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-black-600 mt-2">{content}</p>
      </div>
      <button className="mt-4 self-start px-4 py-2 bg-primary text-black border border-gray-800 rounded hover:bg-gray-200 transition-colors duration-300">Read More</button>
    </div>
  </div>
);

const Blog = () => {
  const dummyBlogs = [
    { title: 'Kerajinan Tangan Mbah Marto', content: 'Lorem ipsum dolor sit amet...', imageUrl: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Artikel Terbaru</h2>
      <div className="grid grid-cols-1 gap-4">
        {dummyBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
