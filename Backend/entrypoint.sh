#!/bin/sh

echo "🔐 Initializing Google Drive credentials..."

# Decode GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64 if present
if [ -n "$GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64" ]; then
  echo "📝 Decoding GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64..."
  echo "$GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64" | base64 -d > /app/service-account.json
  echo "✅ service-account.json created"
fi

# Decode GOOGLE_DRIVE_VIEWER_KEY_B64 if present
if [ -n "$GOOGLE_DRIVE_VIEWER_KEY_B64" ]; then
  echo "📝 Decoding GOOGLE_DRIVE_VIEWER_KEY_B64..."
  echo "$GOOGLE_DRIVE_VIEWER_KEY_B64" | base64 -d > /app/client-viewer-service-account.json
  echo "✅ client-viewer-service-account.json created"
fi

echo "🚀 Starting Antigone RH Backend..."
exec java -jar app.jar
