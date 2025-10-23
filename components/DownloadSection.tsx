'use client';

import Image from 'next/image';
import { DownloadSectionProps } from '@/types/components';
import ErrorMessage from './ErrorMessage';

export default function DownloadSection({
  videoData,
  onDownload,
  isDownloading,
  downloadProgress,
  downloadError,
}: DownloadSectionProps) {
  if (!videoData) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Video Info Card */}
      <div className="bg-apple-bg-secondary rounded-apple p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <div className="relative w-full md:w-48 h-36 rounded-lg overflow-hidden bg-gray-200">
              {videoData.thumbnail && (
                <Image
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold text-apple-text-primary line-clamp-2">
              {videoData.title}
            </h2>
            <p className="text-sm text-apple-text-secondary">
              {videoData.author}
            </p>
            <p className="text-sm text-apple-text-secondary">
              Duration: {formatDuration(videoData.duration)}
            </p>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-apple-text-primary">
          Download Options
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onDownload('mp4')}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 px-6 py-4 
                     bg-apple-bg-secondary border border-apple-border rounded-apple
                     hover:bg-apple-hover-bg active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          >
            <svg className="w-6 h-6 text-apple-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-apple-text-primary">Download MP4</div>
              <div className="text-sm text-apple-text-secondary">Video format</div>
            </div>
          </button>

          <button
            onClick={() => onDownload('mp3')}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 px-6 py-4 
                     bg-apple-bg-secondary border border-apple-border rounded-apple
                     hover:bg-apple-hover-bg active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          >
            <svg className="w-6 h-6 text-apple-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-apple-text-primary">Download MP3</div>
              <div className="text-sm text-apple-text-secondary">Audio only</div>
            </div>
          </button>
        </div>

        {/* Download Progress */}
        {isDownloading && downloadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-apple-text-secondary">
              <span>Downloading...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-apple-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-apple-accent h-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Error */}
        {downloadError && (
          <ErrorMessage message={downloadError} />
        )}
      </div>
    </div>
  );
}
