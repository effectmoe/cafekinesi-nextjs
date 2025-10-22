import { publicClient } from '../lib/sanity.client';
import { groq } from 'next-sanity';

async function checkFAQAnswers() {
  const faqs = await publicClient.fetch(groq`
    *[_type == "faq"] {
      _id,
      question,
      "hasAnswer": defined(answer),
      "answerLength": length(answer),
      "answerType": select(
        !defined(answer) => "undefined",
        answer == "" => "empty_string",
        "has_content"
      )
    } | order(_id)
  `);

  console.log('📊 FAQ Analysis from Sanity:');
  console.log('Total FAQs:', faqs.length);
  console.log('');

  const withContent = faqs.filter((f: any) => f.answerType === 'has_content');
  const withoutAnswer = faqs.filter((f: any) => !f.hasAnswer);
  const emptyAnswer = faqs.filter((f: any) => f.answerType === 'empty_string');

  console.log('✅ FAQs with content:', withContent.length);
  console.log('❌ FAQs without answer field:', withoutAnswer.length);
  console.log('⚠️  FAQs with empty string:', emptyAnswer.length);
  console.log('');

  if (withoutAnswer.length > 0) {
    console.log('FAQs missing answer field:');
    withoutAnswer.forEach((f: any) => console.log('  -', f._id, ':', f.question));
    console.log('');
  }

  if (emptyAnswer.length > 0) {
    console.log('FAQs with empty answer:');
    emptyAnswer.forEach((f: any) => console.log('  -', f._id, ':', f.question));
    console.log('');
  }

  // Show answer length distribution
  console.log('Answer length distribution:');
  const lengths = withContent.map((f: any) => f.answerLength);
  console.log('  Min:', Math.min(...lengths));
  console.log('  Max:', Math.max(...lengths));
  console.log('  Avg:', Math.round(lengths.reduce((a: number, b: number) => a + b, 0) / lengths.length));
}

checkFAQAnswers();
