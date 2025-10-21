import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome heading', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to MovieAI/i);
  expect(heading).toBeInTheDocument();
});

test('renders Trending Movies placeholder section', () => {
  render(<App />);
  const trending = screen.getByText(/Trending Movies/i);
  expect(trending).toBeInTheDocument();
});
