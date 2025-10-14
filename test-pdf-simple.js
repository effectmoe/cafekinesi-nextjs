const fs = require('fs');
const pdf = require('pdf-parse');

console.log('Testing PDF with pdf-parse...\n');

const dataBuffer = fs.readFileSync('/Users/tonychustudio/Desktop/石野歯科医院様診療科目詳細.pdf');
console.log('File size:', (dataBuffer.length / 1024).toFixed(2), 'KB\n');

pdf(dataBuffer).then(function(data) {
  console.log('✅ pdf-parse succeeded');
  console.log('Pages:', data.numpages);
  console.log('Text length:', data.text.length);
  console.log('\nText preview (first 500 chars):');
  console.log(data.text.substring(0, 500));
  console.log('\nPDF Info:', JSON.stringify(data.info, null, 2));

  if (data.text.length === 0) {
    console.log('\n⚠️  WARNING: This PDF contains NO extractable text!');
    console.log('This is definitely an image-based (scanned) PDF.');
  } else if (data.text.length < 100) {
    console.log('\n⚠️  WARNING: Very little text extracted (<100 chars)');
    console.log('Full text:', JSON.stringify(data.text));
  }
}).catch(function(error) {
  console.error('❌ pdf-parse failed:', error.message);
  console.error(error.stack);
});
