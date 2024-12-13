import React, { useState, useEffect } from 'react';

const ProductCard = ({ title, price, location, rating, imageUrl }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    console.log("Image URL:", imageUrl);
  }, [imageUrl]);

  return (
    <div className="border bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-40 sm:h-48 md:h-60 object-cover"
        onError={() => {
          console.log("Image failed to load, setting to placeholder.");
          setImgSrc("/placeholder.png");
        }}
      />
      <div className="p-2 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg">{title}</h3>
        <p className="text-sm sm:text-lg text-primary font-semibold">{price}</p>
        <div className="flex items-center text-yellow-500 mt-1 sm:mt-2">
          ⭐ {rating}
        </div>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base">{location}</p>
      </div>
    </div>
  );
};

const Products = () => {
  const dummyProducts = [
    { title: 'Pisang Lumer Banget Deh', price: 'Rp15.000', location: 'Gunungkidul', rating: 4.5, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Snack Enak', price: 'Rp20.000', location: 'Jogjakarta', rating: 4.7, imageUrl: '' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://dummyimage.com/600x400/ddd/000.png&text=Image' },
    { title: 'Minuman Segar', price: 'Rp10.000', location: 'Surakarta', rating: 4.2, imageUrl: 'https://media1.tenor.com/m/0U4fGaBxfVwAAAAd/wizard-cat-cat-wizard.gif' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Produk Terbaru</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummyProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
