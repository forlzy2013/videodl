/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove any script-like content
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validates that a URL is a YouTube URL (whitelist approach)
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    const validDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'm.youtube.com',
    ];

    return validDomains.some(domain => parsedUrl.hostname === domain);
  } catch {
    return false;
  }
}

/**
 * Sanitizes a YouTube URL to ensure it's safe
 */
export function sanitizeYouTubeUrl(url: string): string {
  const sanitized = sanitizeInput(url);
  
  if (!isValidYouTubeUrl(sanitized)) {
    throw new Error('Invalid YouTube URL');
  }
  
  return sanitized;
}
