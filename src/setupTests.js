// For @testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// If you're using fetch or other globals in tests
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs cleanup after each test case
afterEach(() => {
  cleanup();
});