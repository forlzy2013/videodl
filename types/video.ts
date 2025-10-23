// Video metadata and format interfaces

export interface VideoMetadata {
  videoId: string;
  title: string;
  author: string;
  duration: number; // in seconds
  thumbnail: string; // URL
  description?: string;
  formats: VideoFormat[];
  createdAt: Date;
}

export interface VideoFormat {
  itag: number;
  quality: string; // '720p', '1080p', etc.
  container: string; // 'mp4', 'webm'
  hasVideo: boolean;
  hasAudio: boolean;
  contentLength?: string;
  url: string;
}

export interface DownloadState {
  isDownloading: boolean;
  progress: number; // 0-100
  error: string | null;
  format: 'mp4' | 'mp3' | null;
}
