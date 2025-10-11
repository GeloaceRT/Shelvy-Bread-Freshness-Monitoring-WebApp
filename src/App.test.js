import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login welcome message', () => {
  render(<App />);
  const welcomeHeading = screen.getByText(/welcome back!/i);
  expect(welcomeHeading).toBeInTheDocument();
});
