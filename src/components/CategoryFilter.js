// src/components/CategoryFilter.js
import React from 'react';

const CategoryFilter = ({ categories, setCategory }) => {
  return (
    <div className="my-3">
      <h2>Categories</h2>
      {categories.map(category => (
        <button key={category} className="btn btn-outline-primary mx-2" onClick={() => setCategory(category)}>
          {category}
        </button>
      ))}
      <button className="btn btn-outline-primary mx-2" onClick={() => setCategory('All')}>All</button>
    </div>
  );
};

export default CategoryFilter;
