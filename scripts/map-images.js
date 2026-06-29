import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destAppPath = path.join(__dirname, '../src/App.jsx');
let newApp = fs.readFileSync(destAppPath, 'utf8');

// The original map from the previous run
const map = {
  "Editorial fashion portrait": "/assets/ad274ce3097e7f44c8e612c6b3373139aa329cc3.png",
  "Woman in black coat cinematic dark": "/assets/e37ca59c98504c97b809f6b0573114c4c632b984.png", // reusing one of the images
  "Luxury wine packaging box": "/assets/e89add6920e3dd49952dd44946b71060231dc239.png", // reusing packaging
  "Mobile app screens side by side": "/assets/d64d7fc4ca830da17517830e3cdf0df88503b923.png",
  "Brand stationary mockup": "/assets/255f15408d482942a3a822b169bfce077684d2ba.png",
  "Abstract gray and blue texture": "/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png" // background image
};

const blockRegex2 = /src:\s*"([^"]+)",\s*alt:\s*"([^"]+)",/g;
newApp = newApp.replace(blockRegex2, (fullMatch, imgUrl, altText) => {
  if (map[altText]) {
    console.log(`Mapped src: "${altText}" -> ${map[altText]}`);
    return `src: "${map[altText]}",\n    alt: "${altText}",`;
  }
  return fullMatch;
});

// Also there's a background image in a direct tag: src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop&auto=format"
newApp = newApp.replace(/src="https:\/\/images\.unsplash\.com\/photo-1478760329108-[^"]+"/g, 'src="/assets/3b8d1031640f6c622f117ccc3cea45e112591b6b.png"');

fs.writeFileSync(destAppPath, newApp);
console.log('Successfully mapped remaining images');
