import React from 'react';

function ProductReviews() {
  return (
    <div className="p-4 border-t border-gray-300">
      <div className="flex flex-col md:flex-row items-start mb-6">
        <div className="w-full md:w-1/3">
          <div className="flex items-center mb-4">
            <div className="w-4 h-8 bg-red-500 rounded mr-2"></div>
            <h2 className="text-xl font-bold text-red-500">Ulasan Product</h2>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 text-2xl mr-2">⭐</span>
            <span className="text-3xl font-bold">5.0</span>
            <span className="text-lg">/5.0</span>
          </div>
          <p className="text-gray-700 mb-2">100% Pembeli Merasa Puas</p>
          <p className="text-gray-500 mb-4">2 Rating - 1 Ulasan</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-4">{rating}</span>
                <div className="flex-1 h-2 bg-gray-300 ml-2">
                  {rating === 5 && <div className="h-2 bg-red-500" style={{ width: '80%' }}></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 ml-0 md:ml-8 mt-6">
          <h3 className="font-bold mb-2">Foto & Video Pembeli</h3>
          <div className="text-center">
            <img src="https://via.placeholder.com/150" alt="Ulasan Pilihan" className="mb-4 rounded" />
          </div>
          <h3 className="font-bold mb-2">Ulasan Pilihan</h3>
        </div>
      </div>
    </div>
  );
}

export default ProductReviews;
