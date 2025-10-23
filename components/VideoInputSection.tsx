'use client';

import { useState, useEffect, useCallback } from 'react';
import { VideoInputSectionProps } from '@/types/components';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { debounce } from '@/lib/utils/debounce';

export default function VideoInputSection({
  url,
  onUrlChange,
  onAnalyze,
  isLoading,
  error,
}: VideoInputSectionProps) {
  const [isValidating, setIsValidating] = useState(false);

  // Debounced URL validation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateUrl = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        // Basic YouTube URL pattern check
        const youtubePattern = /(youtube\.com|youtu\.be)/;
        setIsValidating(youtubePattern.test(value));
      } else {
        setIsValidating(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    validateUrl(url);
  }, [url, validateUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && url.trim()) {
      await onAnalyze();
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste YouTube URL here..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-apple-border rounded-apple text-body
                     focus:outline-none focus:ring-2 focus:ring-apple-accent focus:border-transparent
                     disabled:bg-apple-bg-secondary disabled:cursor-not-allowed
                     transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-6 py-3 bg-apple-accent text-white text-button rounded-apple
                     hover:bg-blue-600 active:scale-95
                     disabled:bg-apple-border disabled:cursor-not-allowed
                     transition-all duration-200 font-medium
                     sm:w-auto w-full"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={onAnalyze}
          />
        )}

        {isLoading && (
          <div className="py-8">
            <LoadingSpinner message="Analyzing video..." />
          </div>
        )}
      </form>
    </div>
  );
}
