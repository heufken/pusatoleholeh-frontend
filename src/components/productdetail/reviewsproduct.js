import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// Tambahkan fungsi helper untuk menghitung persentase rating
const calculateRatingPercentage = (reviews, starCount, totalReviews) => {
  if (totalReviews === 0) return 0;
  const count = reviews.filter(r => r.rating === starCount).length;
  return (count / totalReviews) * 100;
};

// Komponen untuk bintang yang dapat diklik
const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <span className={`text-2xl transition-colors duration-200 ${
            star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            ★
          </span>
        </button>
      ))}
      <span className="ml-2 text-gray-600">({rating} dari 5)</span>
    </div>
  );
};

// Komponen untuk chart rating
const RatingChart = ({ reviews, totalReviews }) => {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const percentage = calculateRatingPercentage(reviews, star, totalReviews);
        const reviewCount = reviews.filter(r => r.rating === star).length;
        
        return (
          <div key={star} className="flex items-center gap-2">
            <span className="w-4 text-sm text-gray-600">{star}</span>
            <span className="text-yellow-400">★</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 min-w-[40px]">
              {reviewCount}
            </span>
          </div>
        );
      })}
    </div>
  );
};

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isAuthenticated, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const normalizeUrl = useCallback((url) => {
    if (!url) return null;
    const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;
    
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
  }, []);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkUserCanReview();
    }
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${apiUrl}/review/product/${productId}`);
      const normalizedReviews = response.data.reviews.map(review => ({
        ...review,
        images: review.images?.map(image => ({
          ...image,
          url: normalizeUrl(image.url)
        }))
      }));
      setReviews(normalizedReviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkUserCanReview = async () => {
    try {
      // Fetch user's transactions
      const transactionResponse = await axios.get(`${apiUrl}/transaction`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const completedTransactions = transactionResponse.data.transactions.filter(transaction => {
        const status = transactionResponse.data.statuses.find(
          status => status.transactionId === transaction._id
        );
        return status?.status === 'Completed' && 
               transaction.products.some(prod => prod.productId === productId);
      });

      setTransactions(completedTransactions);
      setCanReview(completedTransactions.length > 0);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!transactions[0]?._id) {
      toast.error('No valid transaction found');
      return;
    }

    try {
      // Submit review
      const reviewResponse = await axios.post(
        `${apiUrl}/review/add`,
        {
          productId,
          transactionId: transactions[0]._id,
          rating,
          comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Upload images if any
      if (reviewImages.length > 0 && reviewResponse.data.review._id) {
        const formData = new FormData();
        reviewImages.forEach(image => {
          formData.append('image', image);
        });

        try {
          await axios.post(
            `${apiUrl}/review/upload/images/${reviewResponse.data.review._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          toast.warning('Review posted but failed to upload images');
        }
      }

      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setComment('');
      setRating(5);
      setReviewImages([]);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + reviewImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setReviewImages([...reviewImages, ...files]);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="w-1 h-8 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">Ulasan Produk</h2>
      </div>
      <div className="flex flex-col md:flex-row items-start mb-6">
        <div className="w-full md:w-1/3">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-gray-800 mr-4">{averageRating.toFixed(1)}</div>
            <div>
              <span className="text-yellow-400 text-3xl mr-2">★</span>
              <span className="text-lg text-gray-600 ml-1">/5.0</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            {totalReviews} {totalReviews === 1 ? 'Ulasan' : 'Ulasan'}
          </p>
          <RatingChart reviews={reviews} totalReviews={totalReviews} />
        </div>

        {isAuthenticated && canReview && (
          <div className="w-full md:w-2/3 md:ml-8">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mb-4 px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:opacity-90 transition-all duration-200"
            >
              {showReviewForm ? 'Batal Review' : 'Tulis Review'}
            </button>

            {showReviewForm && (
              <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Rating</label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                  <label className="block mb-2">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Images (Max 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {reviewImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-lg hover:opacity-90 transition-all"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center text-white font-bold">
                  {review.userId.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{review.userId.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.images.map((image, index) => (
                  <div 
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={`Review ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg transition-transform transform hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Review"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
