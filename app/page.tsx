'use client';

import { useState, lazy, Suspense } from 'react';
import VideoInputSection from '@/components/VideoInputSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { VideoMetadata } from '@/types/video';
import { downloadService } from '@/lib/services/DownloadService';
import { ErrorHandler } from '@/lib/utils/ErrorHandler';

// Lazy load DownloadSection for better performance
const DownloadSection = lazy(() => import('@/components/DownloadSection'));

export default function Home() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setVideoData(null);
    setDownloadError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setVideoData(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to analyze video');
        setVideoData(null);
      }
    } catch (err) {
      const userError = ErrorHandler.handle(err as Error);
      ErrorHandler.log(err as Error, { url });
      setError(userError.message);
      setVideoData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async (format: 'mp4' | 'mp3') => {
    if (!videoData) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);

    try {
      await downloadService.downloadVideo(
        videoData,
        format,
        (progress) => setDownloadProgress(progress)
      );
      setDownloadProgress(100);
    } catch (err: any) {
      const userError = ErrorHandler.handle(err);
      ErrorHandler.log(err, { videoId: videoData.videoId, format });
      setDownloadError(userError.message);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen bg-apple-bg">
      <div className="max-w-5xl mx-auto px-section-x py-section-y">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-heading text-apple-text-primary mb-3">
            YouTube Video Downloader
          </h1>
          <p className="text-body text-apple-text-secondary">
            Download YouTube videos in MP4 or MP3 format
          </p>
        </div>

        {/* Main Content - 40/60 Split */}
        <div className="space-y-8">
          {/* Input Section (40%) */}
          <div className="bg-white rounded-apple shadow-sm p-6 border border-apple-border">
            <VideoInputSection
              url={url}
              onUrlChange={setUrl}
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
              error={error}
            />
          </div>

          {/* Download Section (60%) */}
          {videoData && (
            <div className="bg-white rounded-apple shadow-sm p-6 border border-apple-border">
              <Suspense fallback={<LoadingSpinner message="Loading download options..." />}>
                <DownloadSection
                  videoData={videoData}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                  downloadProgress={downloadProgress}
                  downloadError={downloadError}
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-apple-text-secondary">
          <p>All downloads are processed client-side. Your privacy is protected.</p>
        </div>
      </div>
    </main>
  );
}
