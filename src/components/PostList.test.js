import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import PostList from './PostList';

jest.mock('axios');

describe('PostList', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('should fetch and display posts', async () => {
    const posts = [
      { id: 1, title: 'Post 1', body: 'Body of Post 1' },
      { id: 2, title: 'Post 2', body: 'Body of Post 2' },
    ];

    axios.get.mockResolvedValueOnce({ data: posts });

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Body of Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
      expect(screen.getByText('Body of Post 2')).toBeInTheDocument();
    });
  });

  it('should display loading state while fetching posts', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<PostList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('should display error message if API request fails', async () => {
    const errorMessage = 'An error occurred while fetching the posts.';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    render(<PostList />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });
});
