import React from 'react';

function LandingPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Awesome Homepage</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-500 dark:bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Welcome to My Site</h2>
          <p className="text-lg mb-8">
            Discover amazing content, articles, and insights.
          </p>
          <button className="bg-white dark:bg-gray-800 text-blue-500 dark:text-gray-100 font-semibold py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Feature One</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Feature Two</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Feature Three</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-500 dark:bg-gray-900 text-white dark:text-gray-300 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; 2024 My Awesome Site. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
