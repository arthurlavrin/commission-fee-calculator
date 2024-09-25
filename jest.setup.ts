import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Mock console.error globally
console.error = jest.fn();
