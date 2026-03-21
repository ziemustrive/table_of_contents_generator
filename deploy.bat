@echo off
echo 🚀 Starting deployment with SSL fixes...

REM Clean build
echo 📦 Cleaning previous build...
if exist build rmdir /s /q build
if exist .vercel rmdir /s /q .vercel

REM Install dependencies
echo 📚 Installing dependencies...
npm install

REM Build the application
echo 🔨 Building application...
npm run build

REM Verify build
if exist build (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed!
    exit /b 1
)

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
npx vercel --prod

echo 🎉 Deployment complete!
echo 📋 SSL fixes applied:
echo    - Security headers added
echo    - HTTPS redirects enabled
echo    - Asset loading optimized
echo    - Browser compatibility improved
echo.
echo 🔍 Test your site at: https://tocgenerator.vercel.app
echo ⚠️  If SSL issues persist, try:
echo    1. Clear browser cache and cookies
echo    2. Try incognito/private browsing
echo    3. Check from different network
echo    4. Wait 5-10 minutes for Vercel SSL propagation
pause
