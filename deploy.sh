#!/bin/bash

# Vercel SSL Fix Deployment Script
echo "🚀 Starting deployment with SSL fixes..."

# Clean build
echo "📦 Cleaning previous build..."
rm -rf build
rm -rf .vercel

# Install dependencies
echo "📚 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build
if [ -d "build" ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment complete!"
echo "📋 SSL fixes applied:"
echo "   - Security headers added"
echo "   - HTTPS redirects enabled"
echo "   - Asset loading optimized"
echo "   - Browser compatibility improved"
echo ""
echo "🔍 Test your site at: https://tocgenerator.vercel.app"
echo "⚠️  If SSL issues persist, try:"
echo "   1. Clear browser cache and cookies"
echo "   2. Try incognito/private browsing"
echo "   3. Check from different network"
echo "   4. Wait 5-10 minutes for Vercel SSL propagation"
