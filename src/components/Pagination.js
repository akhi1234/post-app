import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
