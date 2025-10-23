# YouTube Video Downloader

A modern, privacy-focused web application for downloading YouTube videos in MP4 or MP3 format. Built with Next.js and featuring a clean, Apple-inspired design.

## Features

- 🎥 **Video Analysis**: Paste any YouTube URL to fetch video metadata
- 📥 **Multiple Formats**: Download videos as MP4 or audio as MP3
- 🔒 **Privacy First**: All downloads processed client-side, no data storage
- 🎨 **Modern UI**: Clean, minimalist design inspired by Apple's design principles
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Optimized performance with code splitting and lazy loading
- 🛡️ **Secure**: Input sanitization, XSS protection, and rate limiting

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Processing**: @distube/ytdl-core (actively maintained fork)
- **File Downloads**: FileSaver.js
- **Deployment**: Replit

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-video-downloader
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/          # API route for video analysis
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── DownloadSection.tsx   # Video download UI
│   ├── ErrorMessage.tsx      # Error display component
│   ├── LoadingSpinner.tsx    # Loading indicator
│   └── VideoInputSection.tsx # URL input component
├── lib/
│   ├── services/
│   │   ├── DownloadService.ts       # Client-side download logic
│   │   └── VideoMetadataService.ts  # YouTube metadata fetching
│   └── utils/
│       ├── debounce.ts       # Debounce utility
│       ├── ErrorHandler.ts   # Error handling utility
│       └── sanitize.ts       # Input sanitization
├── types/
│   ├── api.ts                # API type definitions
│   ├── components.ts         # Component prop types
│   └── video.ts              # Video data types
└── .kiro/specs/              # Feature specifications
```

## Features in Detail

### Video Analysis
- Supports standard YouTube URLs, shortened URLs (youtu.be), and mobile URLs
- Fetches video metadata including title, author, duration, and thumbnail
- Displays available download formats

### Download Options
- **MP4**: Download full video with audio
- **MP3**: Extract audio only
- Progress tracking during download
- Error handling with retry options

### Security
- Content Security Policy headers
- XSS protection through input sanitization
- Rate limiting (10 requests per minute per IP)
- No permanent data storage
- HTTPS enforced in production

### Performance Optimizations
- Code splitting with dynamic imports
- Image optimization for thumbnails
- Debounced URL validation (300ms)
- Gzip compression enabled
- Lazy loading of heavy components

## API Routes

### POST /api/analyze
Analyzes a YouTube URL and returns video metadata.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videoId": "VIDEO_ID",
    "title": "Video Title",
    "author": "Channel Name",
    "duration": 180,
    "thumbnail": "https://...",
    "formats": [...]
  }
}
```

## Environment Variables

Optional environment variables (create a `.env.local` file):

```env
# Optional: Supabase configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URL (set automatically by Replit)
NEXT_PUBLIC_APP_URL=https://your-app.replit.app
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Replit.

Quick deploy:
1. Import project to Replit
2. Click "Deploy"
3. Your app will be live at `https://your-app-name.replit.app`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Legal

- All video processing happens client-side in the user's browser
- No user data is stored permanently
- No tracking or analytics
- Users are responsible for complying with YouTube's Terms of Service
- This tool is for personal use only

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Troubleshooting

### "An unexpected error occurred" when analyzing videos

If you encounter this error:
1. Check the Replit console logs for detailed error messages
2. Ensure you're using the latest version of `@distube/ytdl-core`
3. Some videos may be restricted or require authentication
4. Try a different video URL to verify the service is working

### YouTube API Changes

YouTube frequently updates their API, which can break video downloading libraries. This project uses `@distube/ytdl-core`, an actively maintained fork that's updated regularly to handle these changes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Video processing powered by [@distube/ytdl-core](https://github.com/distubejs/ytdl-core)
- File downloads via [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- Design inspired by Apple's design principles

## Support

For issues and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue in the repository
