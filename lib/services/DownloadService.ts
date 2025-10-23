import { saveAs } from 'file-saver';
import { VideoMetadata } from '@/types/video';

export class DownloadService {
  /**
   * Downloads a video in the specified format
   * This is a client-side operation using the browser's download capability
   */
  async downloadVideo(
    videoData: VideoMetadata,
    format: 'mp4' | 'mp3',
    onProgress?: (progress: number) => void
  ): Promise<void> {
    try {
      // Find the best format for download
      const selectedFormat = this.selectBestFormat(videoData, format);
      
      if (!selectedFormat || !selectedFormat.url) {
        throw new Error('No suitable format found for download');
      }

      // Fetch the video data
      const response = await fetch(selectedFormat.url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }

      // Get the response as a blob with progress tracking
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      let loaded = 0;
      const reader = response.body?.getReader();
      const chunks: BlobPart[] = [];

      if (!reader) {
        throw new Error('Unable to read video stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress && total > 0) {
          const progress = Math.round((loaded / total) * 100);
          onProgress(progress);
        }
      }

      // Combine chunks into a single blob
      const blob = new Blob(chunks, { 
        type: format === 'mp4' ? 'video/mp4' : 'audio/mpeg' 
      });

      // Generate filename
      const filename = this.generateFilename(videoData.title, format);

      // Trigger download
      this.triggerDownload(blob, filename);

    } catch (error: any) {
      console.error('Download error:', error);
      throw new Error('DOWNLOAD_ERROR');
    }
  }

  /**
   * Selects the best format for the requested download type
   */
  private selectBestFormat(videoData: VideoMetadata, format: 'mp4' | 'mp3') {
    if (format === 'mp4') {
      // For MP4, find the best quality format with both video and audio
      const mp4Formats = videoData.formats.filter(
        f => f.container === 'mp4' && f.hasVideo && f.hasAudio
      );
      
      // Sort by quality (prefer 720p or 1080p)
      return mp4Formats.sort((a, b) => {
        const qualityOrder = ['1080p', '720p', '480p', '360p', '240p', '144p'];
        const aIndex = qualityOrder.indexOf(a.quality);
        const bIndex = qualityOrder.indexOf(b.quality);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })[0];
    } else {
      // For MP3, find audio-only format or any format with audio
      const audioFormats = videoData.formats.filter(f => f.hasAudio);
      return audioFormats[0];
    }
  }

  /**
   * Generates a safe filename from the video title
   */
  private generateFilename(title: string, format: 'mp4' | 'mp3'): string {
    // Remove invalid filename characters
    const safeTitle = title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100); // Limit length
    
    return `${safeTitle}.${format}`;
  }

  /**
   * Creates a Blob from data
   */
  generateBlob(data: ArrayBuffer, mimeType: string): Blob {
    return new Blob([data], { type: mimeType });
  }

  /**
   * Triggers the browser download using FileSaver.js
   */
  triggerDownload(blob: Blob, filename: string): void {
    saveAs(blob, filename);
  }
}

// Export singleton instance
export const downloadService = new DownloadService();
