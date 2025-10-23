import ytdl from '@distube/ytdl-core';
import { VideoMetadata, VideoFormat } from '@/types/video';

export class VideoMetadataService {
  /**
   * Validates if the provided URL is a valid YouTube URL
   * Supports standard and shortened YouTube URLs
   */
  validateYouTubeUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // YouTube URL patterns
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[\w-]+/,
      /^(https?:\/\/)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/,
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Extracts the video ID from various YouTube URL formats
   */
  extractVideoId(url: string): string {
    if (!this.validateYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL');
    }

    try {
      // Use ytdl-core's built-in method
      const videoId = ytdl.getVideoID(url);
      return videoId;
    } catch (error) {
      throw new Error('Failed to extract video ID from URL');
    }
  }

  /**
   * Fetches video metadata from YouTube
   */
  async getVideoInfo(url: string): Promise<VideoMetadata> {
    if (!this.validateYouTubeUrl(url)) {
      throw new Error('INVALID_URL');
    }

    try {
      const videoId = this.extractVideoId(url);
      
      // Fetch video info using ytdl-core with options
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
      });
      
      // Extract relevant metadata
      const videoDetails = info.videoDetails;
      const formats = info.formats;

      // Filter and map formats to our interface
      const videoFormats: VideoFormat[] = formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          itag: format.itag,
          quality: format.qualityLabel || format.quality || 'unknown',
          container: format.container || 'mp4',
          hasVideo: format.hasVideo,
          hasAudio: format.hasAudio,
          contentLength: format.contentLength || undefined,
          url: format.url,
        }))
        .slice(0, 10); // Limit to top 10 formats

      const metadata: VideoMetadata = {
        videoId,
        title: videoDetails.title,
        author: videoDetails.author.name,
        duration: parseInt(videoDetails.lengthSeconds),
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url || '',
        description: videoDetails.description || undefined,
        formats: videoFormats,
        createdAt: new Date(),
      };

      return metadata;
    } catch (error: any) {
      // Log the actual error for debugging
      console.error('ytdl-core error details:', {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
      });

      // Handle specific error types
      if (error.message?.includes('Video unavailable')) {
        throw new Error('VIDEO_NOT_FOUND');
      }
      if (error.message?.includes('INVALID_URL')) {
        throw new Error('INVALID_URL');
      }
      if (error.statusCode === 429 || error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new Error('RATE_LIMIT');
      }
      if (error.message?.includes('ENOTFOUND') || error.message?.includes('network') || error.message?.includes('ETIMEDOUT')) {
        throw new Error('NETWORK_ERROR');
      }
      if (error.message?.includes('Sign in to confirm') || error.message?.includes('age')) {
        throw new Error('VIDEO_NOT_FOUND');
      }
      
      // Generic error - include original message for debugging
      console.error('Unhandled ytdl-core error:', error.message);
      throw new Error('UNKNOWN_ERROR');
    }
  }
}

// Export singleton instance
export const videoMetadataService = new VideoMetadataService();
