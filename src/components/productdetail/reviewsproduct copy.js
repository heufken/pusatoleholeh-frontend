import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function ProductReviews({ productId }) {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  const [userCanReview, setUserCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    images: []
  });
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState('');

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch reviews and check if user can review
  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkUserCanReview();
    }
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${apiUrl}/review/product/${productId}`);
      setReviews(response.data.reviews);
      setStats({
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkUserCanReview = async () => {
    try {
      // Fetch both transactions and their statuses
      const response = await axios.get(`${apiUrl}/transaction`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter completed transactions for this product
      const validTransactions = response.data.transactions.filter(transaction => {
        // Check if product exists in transaction products
        const hasProduct = transaction.products.some(
          product => product.productId === productId
        );

        // Find corresponding status
        const status = response.data.statuses.find(
          status => status.transactionId === transaction._id
        );

        // Transaction is valid if it has the product and status is 'Completed'
        return hasProduct && status?.status === 'Completed';
      });

      setTransactions(validTransactions);
      setUserCanReview(validTransactions.length > 0);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      toast.error('Failed to check review eligibility');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setReviewForm({ ...reviewForm, images: files });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) {
      toast.error('Please select a transaction');
      return;
    }

    try {
      // Submit review
      const reviewResponse = await axios.post(
        `${apiUrl}/review/add`,
        {
          productId,
          transactionId: selectedTransaction,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Upload images if any
      if (reviewForm.images.length > 0) {
        const formData = new FormData();
        reviewForm.images.forEach(image => {
          formData.append('image', image);
        });

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
      }

      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '', images: [] });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="p-4 border-t border-gray-300">
      {/* Review Statistics */}
      <div className="flex flex-col md:flex-row items-start mb-6">
        <div className="w-full md:w-1/3">
          <div className="flex items-center mb-4">
            <div className="w-4 h-8 bg-red-500 rounded mr-2"></div>
            <h2 className="text-xl font-bold text-red-500">Ulasan Produk</h2>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 text-2xl mr-2">⭐</span>
            <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
            <span className="text-lg">/5.0</span>
          </div>
          <p className="text-gray-500 mb-4">{stats.totalReviews} Ulasan</p>
          
          {/* Rating Bars */}
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = (count / stats.totalReviews) * 100 || 0;
              return (
                <div key={rating} className="flex items-center">
                  <span className="w-4">{rating}</span>
                  <div className="flex-1 h-2 bg-gray-200 ml-2 rounded-full">
                    <div 
                      className="h-2 bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Form Button */}
        {userCanReview && (
          <div className="w-full md:w-2/3 md:pl-8 mt-6 md:mt-0">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Tulis Ulasan
            </button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Pilih Transaksi</label>
            <select
              value={selectedTransaction}
              onChange={(e) => setSelectedTransaction(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Pilih transaksi</option>
              {transactions.map(t => (
                <option key={t._id} value={t._id}>
                  {new Date(t.createdAt).toLocaleDateString()} - {t.orderNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`text-2xl ${
                    star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Komentar</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Foto (Maksimal 5)</label>
            <input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Kirim Ulasan
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-6">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">{review.userId.name}</span>
              <div className="flex text-yellow-400">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Review ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            <p className="text-gray-400 text-sm mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
