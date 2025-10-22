import { publicClient } from '../lib/sanity.client';

async function updateAIProvider() {
  try {
    console.log('🔍 Fetching current AI provider settings...');

    // Get current settings
    const currentSettings = await publicClient.fetch(
      '*[_type == "aiProviderSettings" && active == true][0]'
    );

    if (!currentSettings) {
      console.log('❌ No active AI provider settings found in Sanity');
      console.log('Please create an aiProviderSettings document in Sanity Studio first');
      return;
    }

    console.log('📊 Current settings:', {
      name: currentSettings.name,
      provider: currentSettings.provider,
      active: currentSettings.active
    });

    if (currentSettings.provider === 'openai') {
      console.log('✅ Provider is already set to openai, no update needed');
      return;
    }

    console.log('🔄 Updating provider to openai...');

    // Update using the write client (needs SANITY_API_TOKEN with write permissions)
    const { createClient } = await import('@sanity/client');

    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
      token: process.env.SANITY_API_TOKEN!,
      useCdn: false
    });

    await writeClient
      .patch(currentSettings._id)
      .set({ provider: 'openai' })
      .commit();

    console.log('✅ Successfully updated AI provider to openai');

    // Verify the update
    const updatedSettings = await publicClient.fetch(
      '*[_type == "aiProviderSettings" && active == true][0]'
    );

    console.log('✅ Verified settings:', {
      name: updatedSettings.name,
      provider: updatedSettings.provider,
      active: updatedSettings.active
    });

  } catch (error) {
    console.error('❌ Error updating AI provider:', error);
    process.exit(1);
  }
}

updateAIProvider();
