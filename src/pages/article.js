import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@heroicons/react/24/solid';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const Breadcrumb = () => {
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
        <li className="text-gray-500">Kerajinan Tangan Mbah Marto</li>
      </ul>
    </nav>
  );
};

const Article = () => {
  const relatedArticles = [
    {
      title: 'Brownies Inovasi Terbaru',
      image: '/produk 1.webp',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2024-01-15',
      tags: ['Makanan', 'Inovasi'],
    },
    {
      title: 'Kerajinan Tangan Terlaris',
      image: '/produk 3.jpg',
      description: 'Nullam quis risus eget urna mollis ornare vel eu leo.',
      date: '2024-01-14',
      tags: ['Kerajinan', 'Trending'],
    },
    {
      title: 'Kini Bisa Bayar Dengan Kartu!',
      image: '/produk 4.jpg',
      description: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.',
      date: '2024-01-13',
      tags: ['Info', 'Pembayaran'],
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-gray-50">
      <Header />
      <Breadcrumb />
      
      {/* Main Article Section */}
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kerajinan Tangan Mbah Marto</h1>
          <p className="text-gray-600 text-lg">Kerajinan Kuno Yang Masih Eksis Hingga Sekarang</p>
          <div className="absolute -z-10 top-0 left-0 w-72 h-72 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
          <img
            src="/bg.webp"
            alt="Kerajinan Tangan"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-xl p-8 mb-12 relative">
          <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl"></div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">The Standard Lorem Ipsum Passage, Used Since The 1500s</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Section 1.10.32 of "de Finibus Bonorum et Malorum", Written By Cicero in 45 BC
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">1914 Translation By H. Rackham</h3>
            <p className="text-gray-700 leading-relaxed">
              "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system..."
            </p>
          </div>
        </article>

        {/* Related Articles Section */}
        <section className="mb-16">
          <div className="mb-8 relative">
            <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED]"></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <p className="text-gray-600 text-lg">Discover more interesting articles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((article, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#4F46E5] text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="text-right">
                    <Link 
                      to="/article" 
                      className="inline-flex items-center text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors group/link"
                    >
                      <span className="underline underline-offset-2">READ MORE</span>
                      <ChevronRightIcon className="w-4 h-4 ml-1 transform transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Article;
