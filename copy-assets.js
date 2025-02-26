const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'assets');
const destDir = path.join(__dirname, 'dist', 'assets');

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files from src/assets to dist/assets
fs.readdirSync(srcDir).forEach((file) => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(srcFile, destFile);
});

console.log('Assets copied successfully!');