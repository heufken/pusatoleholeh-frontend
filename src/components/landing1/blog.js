import React from "react";

const BlogCard = ({ title, content, imageUrl }) => (
  <div className="border bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full">
    <img
      src={imageUrl}
      alt={title}
      className="w-full md:w-1/4 h-48 md:h-auto object-cover"
    />
    <div className="p-4 flex flex-col justify-between flex-1">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-700 mt-2">{content}</p>
      </div>
      <button className="mt-4 self-start px-4 py-2 bg-primary text-black border border-gray-800 rounded hover:bg-gray-200 transition-colors duration-300">
        Read More
      </button>
    </div>
  </div>
);

const Blog = () => {
  const dummyBlogs = [
    {
      title: "Kerajinan Tangan Mbah Marto",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et tincidunt odio. Integer molestie semper est, sit amet consequat nunc varius non. Donec vestibulum ipsum quis nulla lacinia, quis vehicula ligula aliquam. Ut nec nisi blandit, vehicula justo ut, tristique mi.",
      imageUrl:
        "https://dummyimage.com/600x400/ddd/000.png&text=Image",
    },
    {
      title: "Kerajinan Tangan Mbah Marto",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et tincidunt odio. Integer molestie semper est, sit amet consequat nunc varius non. Donec vestibulum ipsum quis nulla lacinia, quis vehicula ligula aliquam. Ut nec nisi blandit, vehicula justo ut, tristique mi.",
      imageUrl:
        "https://dummyimage.com/600x400/ddd/000.png&text=Image",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
        <button className="text-primary hover:underline">
          Lihat Artikel Lainnya
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dummyBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
