// API request and response interfaces

import { VideoMetadata } from './video';

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: VideoMetadata;
  error?: string;
}

export interface DownloadRequest {
  videoId: string;
  format: 'mp4' | 'mp3';
}

export interface UserFriendlyError {
  message: string;
  canRetry: boolean;
  retryDelay?: number;
}

export type ErrorType = 
  | 'INVALID_URL'
  | 'VIDEO_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT'
  | 'DOWNLOAD_ERROR'
  | 'UNKNOWN_ERROR';
