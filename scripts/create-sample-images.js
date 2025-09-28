const fs = require('fs');
const path = require('path');

// SVGテンプレートで画像を作成
const courses = [
  { id: 'kinesi1', title: 'カフェキネシⅠ', subtitle: '基礎セラピー講座', color: '#f5e6d3' },
  { id: 'peach-touch', title: 'カフェキネシⅡ', subtitle: 'ピーチタッチ', color: '#a8c0d3' },
  { id: 'chakra', title: 'カフェキネシⅢ', subtitle: 'チャクラキネシ', color: '#c8b3d9' },
  { id: 'help', title: 'カフェキネシⅣ', subtitle: 'HELP', color: '#b3d9d3' },
  { id: 'tao', title: 'カフェキネシⅤ', subtitle: 'TAO 道', color: '#e8e8e8' },
  { id: 'happy-aura', title: 'カフェキネシⅥ', subtitle: 'ハッピーオーラ', color: '#f5e6d3' }
];

const publicDir = path.join(__dirname, '..', 'public', 'images', 'school');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

courses.forEach(course => {
  const svg = `
<svg width="280" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="280" height="180" fill="${course.color}"/>
  <text x="140" y="70" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#333">
    ${course.title}
  </text>
  <text x="140" y="105" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#666">
    ${course.subtitle}
  </text>
  <text x="140" y="140" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#999">
    Cafe Kinesi Instructor Course
  </text>
</svg>`;

  const filename = path.join(publicDir, `${course.id}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Created: ${filename}`);
});

console.log('Sample images created successfully!');