import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
it('opens a real field guide with a path into the final two tutorials', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your intelligence.');
  expect(screen.getAllByRole('link', { name: /Your J.A.R.V.I.S./i })[0]).toHaveAttribute('href', '#/jarvis');
  expect(screen.getAllByRole('link', { name: /Your startup team/i })[0]).toHaveAttribute('href', '#/startup-team');
  expect(screen.getByRole('button', { name: /Search the guide/i })).toBeInTheDocument();
});
