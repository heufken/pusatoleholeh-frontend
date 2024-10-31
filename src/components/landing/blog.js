import React from "react";

const BlogCard = ({ title, content, imageUrl }) => (
  <div className="border bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full transition-transform duration-300 hover:scale-105">
    <img
      src={imageUrl}
      alt={title}
      className="w-full md:w-1/3 h-48 md:h-auto object-cover"
    />
    <div className="p-4 flex flex-col justify-between flex-1">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-700 mt-2">{content}</p>
      </div>
      <button className="mt-4 self-start px-4 py-2 bg-white text-black border border-gray-800 rounded hover:bg-gray-100 transition-colors duration-300">
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
        "https://cdn.discordapp.com/attachments/1127401389144940624/1301138562368016394/HANDZ_track_cover_asli.png?ex=67240bf7&is=6722ba77&hm=0cea03a2c82f59d40de913fb91898b8ae5ccee0c0586df55bf1ec822aa7878d0&",
    },
    {
      title: "Kerajinan Tangan Mbah Marto",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et tincidunt odio. Integer molestie semper est, sit amet consequat nunc varius non. Donec vestibulum ipsum quis nulla lacinia, quis vehicula ligula aliquam. Ut nec nisi blandit, vehicula justo ut, tristique mi.",
      imageUrl:
        "https://cdn.discordapp.com/attachments/1127401389144940624/1301138562368016394/HANDZ_track_cover_asli.png?ex=67240bf7&is=6722ba77&hm=0cea03a2c82f59d40de913fb91898b8ae5ccee0c0586df55bf1ec822aa7878d0&",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Recent Blog Posts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dummyBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
