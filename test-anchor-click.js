// アンカーリンクのテストスクリプト
// ブラウザのコンソールで実行

// 最初のアンカーリンクをクリック
const firstAnchor = document.querySelector('a[href="#about"]');
if (firstAnchor) {
  console.log('Testing anchor click for #about');
  firstAnchor.click();
} else {
  console.log('Anchor link #about not found');
}

// 利用可能なすべてのIDを表示
setTimeout(() => {
  const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(id => id);
  console.log('Available IDs on page:', allIds);

  // 各IDの要素の位置を確認
  allIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      console.log(`ID: ${id}, Top: ${rect.top}, Height: ${rect.height}`);
    }
  });
}, 1000);