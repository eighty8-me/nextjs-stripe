import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Home from '@/pages/index';

describe('ログインページ', () => {
  test('Render index page', () => {
    render(<Home />);

    expect(screen.getAllByRole('heading')).toBeTruthy();
  });
});
