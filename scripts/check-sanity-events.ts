import { publicClient } from '../lib/sanity.client';
import { groq } from 'next-sanity';

async function checkSanityEvents() {
  console.log('📅 Fetching events from Sanity CMS...\n');

  const events = await publicClient.fetch(groq`
    *[_type == "event" && defined(slug.current)] {
      _id,
      title,
      slug,
      description,
      content
    }
  `);

  console.log(`Total events: ${events.length}\n`);

  events.forEach((event: any, index: number) => {
    console.log(`${index + 1}. ${event.title}`);
    console.log(`   ID: ${event._id}`);
    console.log(`   Slug: ${event.slug.current}`);

    // Check description type and length
    const descType = typeof event.description;
    const descIsArray = Array.isArray(event.description);
    const descLength = event.description
      ? (typeof event.description === 'string' ? event.description.length : JSON.stringify(event.description).length)
      : 0;
    console.log(`   Description Type: ${descType}${descIsArray ? ' (array)' : ''} (length: ${descLength})`);

    // Check content type and length
    const contentType = typeof event.content;
    const contentIsArray = Array.isArray(event.content);
    const contentLength = event.content
      ? (typeof event.content === 'string' ? event.content.length : JSON.stringify(event.content).length)
      : 0;
    console.log(`   Content Type: ${contentType}${contentIsArray ? ' (array)' : ''} (length: ${contentLength})`);

    // Show first 100 chars of description
    if (event.description) {
      const preview = typeof event.description === 'string'
        ? event.description.substring(0, 100)
        : JSON.stringify(event.description).substring(0, 100);
      console.log(`   Description Preview: ${preview}...`);
    }

    // Show first 100 chars of content
    if (event.content) {
      const preview = typeof event.content === 'string'
        ? event.content.substring(0, 100)
        : JSON.stringify(event.content).substring(0, 100);
      console.log(`   Content Preview: ${preview}...`);
    }

    console.log('');
  });
}

checkSanityEvents();
