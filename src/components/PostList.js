import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
      } catch (error) {
        setError('An error occurred while fetching the posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((post) => {
    const { title, body } = post;
    const query = searchQuery.toLowerCase();
    return title.toLowerCase().includes(query) || body.toLowerCase().includes(query);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const compareValueA = a[sortOption].toLowerCase();
    const compareValueB = b[sortOption].toLowerCase();

    if (sortOrder === 'asc') {
      return compareValueA.localeCompare(compareValueB);
    } else {
      return compareValueB.localeCompare(compareValueA);
    }
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    setSortOption(value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div>
      <div>
        <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search posts" />
        <select value={sortOption} onChange={handleSortChange}>
          <option value="title">Sort by Title</option>
          <option value="body">Sort by Body</option>
        </select>
        <button onClick={handleSortOrderChange}>Toggle Sort Order</button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          {currentPosts.length === 0 ? (
            <div>No posts found.</div>
          ) : (
            <>
              {currentPosts.map((post) => (
                <div key={post.id}>
                  <h2>{post.title}</h2>
                  <p>{post.body}</p>
                </div>
              ))}
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={sortedPosts.length}
                currentPage={currentPage}
                paginate={paginate}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
