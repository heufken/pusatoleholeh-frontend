import React, { useState, useEffect } from 'react';

const ProductCard = ({ title, price, location, rating, imageUrl }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  // Debugging log untuk memastikan URL diterima dengan benar
  useEffect(() => {
    console.log("Image URL:", imageUrl);
  }, [imageUrl]);

  return (
    <div className="border bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-60 object-cover"
        onError={() => {
          console.log("Image failed to load, setting to placeholder.");
          setImgSrc("/placeholder.png");


        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-xl text-primary font-semibold">{price}</p>
        <div className="flex items-center text-yellow-500 mt-2">
          ⭐ {rating}
        </div>
        <p className="text-gray-600">{location}</p>
      </div>
    </div>
  );
};

const Products = () => {
  const dummyProducts = [
    { title: 'Pisang Lumer Banget Deh', price: 'Rp15.000', location: 'Gunungkidul', rating: 4.5, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Snack Enak', price: 'Rp20.000', location: 'Jogjakarta', rating: 4.7, imageUrl: '' }, // Kosong, seharusnya menggunakan placeholder
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://cdn.discordapp.com/attachments/1127401389144940624/1301138562368016394/HANDZ_track_cover_asli.png?ex=67236337&is=672211b7&hm=4227c841fcebfff23e954205f930677d477dfd8079544352089daaf36a963746&' },
    // Tambahkan data produk lainnya
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Produk Terbaru</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummyProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
