export const logError = (message: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable no-console */
    console.error(message, error);
    /* eslint-enable no-console */
  }
};

export const handleApiError = (error: unknown): string => {
  logError('API Error:', error);
  return 'An error occurred. Please try again later.';
}; 