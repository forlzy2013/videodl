import { UserFriendlyError, ErrorType } from '@/types/api';

export class ErrorHandler {
  /**
   * Maps technical errors to user-friendly messages
   */
  static handle(error: Error | string): UserFriendlyError {
    const errorMessage = typeof error === 'string' ? error : error.message;

    // Map error types to user-friendly responses
    const errorMap: Record<ErrorType, UserFriendlyError> = {
      INVALID_URL: {
        message: 'Please enter a valid YouTube URL.',
        canRetry: true,
      },
      VIDEO_NOT_FOUND: {
        message: 'Video not found or unavailable. It may be private or deleted.',
        canRetry: true,
      },
      NETWORK_ERROR: {
        message: 'Connection error. Please check your internet and try again.',
        canRetry: true,
        retryDelay: 2000,
      },
      RATE_LIMIT: {
        message: 'Too many requests. Please wait a moment and try again.',
        canRetry: true,
        retryDelay: 5000,
      },
      DOWNLOAD_ERROR: {
        message: 'Download failed. Please try again.',
        canRetry: true,
      },
      UNKNOWN_ERROR: {
        message: 'An unexpected error occurred. Please try again.',
        canRetry: true,
      },
    };

    // Check if error matches a known type
    for (const [type, response] of Object.entries(errorMap)) {
      if (errorMessage.includes(type)) {
        return response;
      }
    }

    // Default error response
    return errorMap.UNKNOWN_ERROR;
  }

  /**
   * Implements exponential backoff for retry attempts
   */
  static getRetryDelay(attemptNumber: number, baseDelay: number = 1000): number {
    return Math.min(baseDelay * Math.pow(2, attemptNumber), 10000);
  }

  /**
   * Logs errors for debugging (can be extended to send to monitoring service)
   */
  static log(error: Error | string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      if (context) {
        console.error('Context:', context);
      }
    }
    // In production, you could send to a monitoring service like Sentry
  }
}
