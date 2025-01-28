import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { StarIcon, HeartIcon, ShoppingCartIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../components/context/AuthContext";
import { toast } from "react-hot-toast";
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const Breadcrumb = ({ title }) => {
  return (
    <nav className="container mx-auto px-4">
      <ul className="flex list-none p-0 my-4">
        <li className="mr-4">
          <Link to="/" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">Home</Link>
        </li>
        <li className="mr-4 text-gray-500">&gt;</li>
        <li className="mr-4">
          <Link to="/articlehomepage" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">Article</Link>
        </li>
        <li className="mr-4 text-gray-500">&gt;</li>
        <li className="text-gray-500">{title || 'Loading...'}</li>
      </ul>
    </nav>
  );
};

const ArticleDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;
  const navigate = useNavigate();

  const normalizeUrl = useCallback(
    (url) => {
      if (!url) return null;
      
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
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${apiUrl}/article/list`);
        if (response.data.success) {
          const foundArticle = response.data.data.find(
            article => article._id === articleId
          );
          
          if (foundArticle) {
            setArticle(foundArticle);
            // Mencari artikel terkait dengan kategori yang sama
            const related = response.data.data.filter(item => 
              item._id !== articleId && 
              item.categoryId?._id === foundArticle.categoryId?._id
            ).slice(0, 3); // Mengambil maksimal 3 artikel terkait
            setRelatedArticles(related);
          } else {
            setError('Artikel tidak ditemukan');
          }
        } else {
          setError('Gagal memuat artikel');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Artikel tidak ditemukan');
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
      window.scrollTo(0, 0);
    }
  }, [articleId, apiUrl]);

  const handleAddToWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Silakan login untuk menambahkan ke wishlist");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Produk berhasil ditambahkan ke wishlist!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan ke wishlist");
    }
  };

  const handleProductClick = (e, productId) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error || 'Artikel tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5 font-sans">
      <Header />
      <Breadcrumb title={article.title} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
          <div className="flex items-center space-x-4 mb-4">
            {article.categoryId && (
              <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full">
                {article.categoryId.name}
              </span>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(article.createdAt), 'd MMMM yyyy', { locale: id })}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={article.userId?.profileImage || 'https://i.pravatar.cc/100'}
                  alt={article.userId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.userId?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">Penulis</p>
            </div>
          </div>
          <div className="absolute -z-10 top-0 left-0 w-72 h-72 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Cover Image */}
        {article.cover && (
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
            <img
              src={normalizeUrl(article.cover.url)}
              alt={article.title}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}

        {/* Article Content */}
        <article className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg mb-12 relative">
          <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </article>

        {/* Related Products */}
        {article.productIds && article.productIds.length > 0 && (
          <div className="mt-12">
            <div className="mb-8 relative">
              <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Produk Terkait</h2>
              <p className="text-gray-600 text-lg">Produk yang berhubungan dengan artikel ini</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {article.productIds.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                  onClick={(e) => handleProductClick(e, product._id)}
                >
                  <div className="relative">
                    <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl">
                      <img
                        src={normalizeUrl((article.images && article.images[0]?.url) || '/placeholder-product.jpg')}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center rounded-t-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <button 
                        onClick={(e) => handleAddToWishlist(e, product._id)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-lg"
                      >
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <button 
                        onClick={(e) => handleProductClick(e, product._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        Beli
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount > 0 && (
                        <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg shadow-lg">
                          {product.discount}% OFF
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-1 text-xs font-medium text-white bg-[#4F46E5] rounded-lg shadow-lg">
                          New
                        </span>
                      )}
                      {product.stock <= 5 && (
                        <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-lg shadow-lg">
                          Stok Terbatas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">{product.categoryId?.name || "Uncategorized"}</p>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Rp {parseInt(product.price * (1 - (product.discount || 0)/100)).toLocaleString('id-ID')}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            Rp {parseInt(product.price).toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className={`h-4 w-4 ${product.averageRating > 0 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        <span className="text-sm text-gray-600">
                          {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'N/A'}
                        </span>
                        {product.totalReviews > 0 && (
                          <span className="text-sm text-gray-400">({product.totalReviews})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 relative">
              <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Artikel Terkait</h2>
              <p className="text-gray-600 text-lg">Artikel lain dalam kategori {article.categoryId?.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle._id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                    <img
                      src={normalizeUrl(relatedArticle.cover?.url) || '/default-article.jpg'}
                      alt={relatedArticle.title}
                      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      {relatedArticle.categoryId && (
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#4F46E5] text-sm rounded-full">
                          {relatedArticle.categoryId.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>
                        {format(new Date(relatedArticle.createdAt), 'd MMMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {relatedArticle.content}
                    </p>
                    <div className="text-right">
                      <Link 
                        to={`/articleview/${relatedArticle._id}`}
                        className="inline-flex items-center text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors group/link"
                      >
                        <span className="underline underline-offset-2">BACA SELENGKAPNYA</span>
                        <ChevronRightIcon className="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;