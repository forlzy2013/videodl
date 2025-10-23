'use client';

import { useEffect } from 'react';
import { ErrorMessageProps } from '@/types/components';

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className="bg-red-50 border border-apple-error rounded-apple p-4 flex items-start gap-3"
    >
      <div className="flex-shrink-0">
        <svg
          className="w-5 h-5 text-apple-error"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-apple-error font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 text-sm text-apple-accent hover:text-blue-700 font-medium transition-colors"
        >
          Retry
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-apple-text-secondary hover:text-apple-text-primary transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
