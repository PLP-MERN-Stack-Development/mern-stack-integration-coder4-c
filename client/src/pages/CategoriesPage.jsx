import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/api';
import Layout from '../components/Layout';
import useApi from '../hooks/useApi';

const CategoriesPage = () => {
  const { data: categories, loading, error, execute: fetchCategories } = useApi(
    categoryService.getAllCategories,
    []
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading categories: {error}</p>
          <button
            onClick={() => fetchCategories()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>

        {categories && categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                <p className="text-gray-600 mb-4">
                  {category.description || 'Explore posts in this category'}
                </p>
                <Link
                  to={`/?category=${category._id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Posts →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;