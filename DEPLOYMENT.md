# Deployment Guide for Replit

## Prerequisites
- A Replit account
- This project imported into Replit

## Deployment Steps

### 1. Environment Setup
The project is pre-configured for Replit deployment. No additional environment variables are required for basic functionality.

Optional environment variables (if using Supabase):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 2. Development Mode
To run the application in development mode:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### 3. Production Build
To create a production build:
```bash
npm run build
```

### 4. Production Mode
To run the production build:
```bash
npm run start
```

### 5. Deploy to Replit
1. Click the "Deploy" button in Replit
2. The deployment will automatically:
   - Run `npm run build`
   - Start the production server with `npm run start`
3. Your app will be available at `https://your-app-name.replit.app`

## Configuration Files

### .replit
- Defines the run command for development
- Configures deployment settings
- Maps port 3000 to external port 80

### replit.nix
- Specifies Node.js 18.x environment
- Includes npm and TypeScript dependencies

## Security Features
- Content Security Policy headers configured
- XSS protection enabled
- Input sanitization implemented
- Rate limiting on API routes (10 requests/minute)
- No permanent data storage

## Performance
- Gzip compression enabled
- Image optimization for thumbnails
- Code splitting for optimal loading
- Target load time: < 3 seconds

## Monitoring
Check the Replit console for:
- Build errors
- Runtime errors
- API request logs

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`

### API Errors
- Verify YouTube URLs are accessible
- Check rate limiting isn't being exceeded
- Review console logs for detailed error messages

### Performance Issues
- Monitor memory usage in Replit dashboard
- Check for concurrent request handling
- Verify image optimization is working

## Support
For issues specific to this deployment, check:
- Next.js documentation: https://nextjs.org/docs
- Replit documentation: https://docs.replit.com
