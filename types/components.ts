// Component prop interfaces

import { VideoMetadata } from './video';

export interface HomePageProps {
  // Main container component
}

export interface HomePageState {
  url: string;
  isAnalyzing: boolean;
  videoData: VideoMetadata | null;
  error: string | null;
}

export interface VideoInputSectionProps {
  url: string;
  onUrlChange: (url: string) => void;
  onAnalyze: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface DownloadSectionProps {
  videoData: VideoMetadata | null;
  onDownload: (format: 'mp4' | 'mp3') => Promise<void>;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string | null;
}

export interface LoadingSpinnerProps {
  message?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}
