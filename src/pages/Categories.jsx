import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../components/ThemeProvider';

function Categories() {
  const { theme } = useContext(ThemeContext);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Tech', 'Lifestyle', 'Personal Development', 
    'DIY', 'Business and Finance', 'Arts and Culture'
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  return (
    <div className={`flex flex-col min-h-screen w-full items-center ${theme.backgroundColor}`}>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-white mt-10 text-4xl font-bold font-mono text-center mb-8">
          Choose Your <span className="text-purple-400">Categories</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`text-white text-lg py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105
                ${selectedCategories.includes(category) 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500' 
                  : 'bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-20'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button className="text-purple-400 underline text-lg hover:text-pink-400 transition-colors">
            Other Categories
          </button>

          <Link to="/Home">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg transition-all hover:from-purple-700 hover:to-pink-600 hover:scale-105"
              onClick={() => console.log('Selected categories:', selectedCategories)}
            >
              Next
            </button>
          </Link>
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-8 text-center">
            <h2 className="text-white text-2xl mb-4">Selected Categories:</h2>
            <p className="text-purple-300">{selectedCategories.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
