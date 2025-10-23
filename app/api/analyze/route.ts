import { NextRequest, NextResponse } from 'next/server';
import { videoMetadataService } from '@/lib/services/VideoMetadataService';
import { AnalyzeRequest, AnalyzeResponse } from '@/types/api';
import { sanitizeYouTubeUrl } from '@/lib/utils/sanitize';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      const response: AnalyzeResponse = {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
      };
      return NextResponse.json(response, { status: 429 });
    }

    // Parse request body
    const body: AnalyzeRequest = await request.json();
    let { url } = body;

    // Validate URL presence
    if (!url || typeof url !== 'string') {
      const response: AnalyzeResponse = {
        success: false,
        error: 'Please provide a valid YouTube URL.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Sanitize and validate YouTube URL
    try {
      url = sanitizeYouTubeUrl(url);
    } catch {
      const response: AnalyzeResponse = {
        success: false,
        error: 'Please enter a valid YouTube URL.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate YouTube URL format
    if (!videoMetadataService.validateYouTubeUrl(url)) {
      const response: AnalyzeResponse = {
        success: false,
        error: 'Please enter a valid YouTube URL.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Fetch video metadata
    const videoData = await videoMetadataService.getVideoInfo(url);

    const response: AnalyzeResponse = {
      success: true,
      data: videoData,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('Error analyzing video:', error);

    // Map error types to user-friendly messages
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;

    if (error.message === 'INVALID_URL') {
      errorMessage = 'Please enter a valid YouTube URL.';
      statusCode = 400;
    } else if (error.message === 'VIDEO_NOT_FOUND') {
      errorMessage = 'Video not found or unavailable.';
      statusCode = 404;
    } else if (error.message === 'NETWORK_ERROR') {
      errorMessage = 'Connection error. Please check your internet and try again.';
      statusCode = 503;
    } else if (error.message === 'RATE_LIMIT') {
      errorMessage = 'Too many requests to YouTube. Please wait a moment and try again.';
      statusCode = 429;
    }

    const response: AnalyzeResponse = {
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: statusCode });
  }
}
