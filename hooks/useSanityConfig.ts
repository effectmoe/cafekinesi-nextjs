import { useState, useEffect } from 'react';
import { publicClient } from '@/lib/sanity.client';

export function useChatConfiguration() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await publicClient.fetch(`
          *[_type == "chatConfiguration" && active == true][0] {
            title,
            active,
            config {
              chatUI {
                title,
                welcomeMessage,
                placeholder,
                primaryColor
              },
              quickQuestions[] {
                icon,
                label,
                question
              }
            }
          }
        `);
        setConfig(data);
      } catch (error) {
        console.error('チャット設定取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();

    // リアルタイム購読
    const subscription = publicClient
      .listen('*[_type == "chatConfiguration"]')
      .subscribe(fetchConfig);

    return () => subscription.unsubscribe();
  }, []);

  return { config, loading };
}

export function useAIGuardrails() {
  const [guardrails, setGuardrails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardrails = async () => {
      try {
        const data = await publicClient.fetch(`
          *[_type == "aiGuardrails" && active == true][0] {
            name,
            active,
            systemPrompt,
            rules {
              maxResponseLength,
              temperature,
              prohibitedWords,
              tone
            }
          }
        `);
        setGuardrails(data);
      } catch (error) {
        console.error('AIガードレール取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuardrails();

    // リアルタイム購読
    const subscription = publicClient
      .listen('*[_type == "aiGuardrails"]')
      .subscribe(fetchGuardrails);

    return () => subscription.unsubscribe();
  }, []);

  return { guardrails, loading };
}

export function useRAGConfiguration() {
  const [ragConfig, setRAGConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await publicClient.fetch(`
          *[_type == "ragConfiguration" && active == true][0] {
            name,
            active,
            vectorSearch {
              enabled,
              topK,
              threshold,
              chunkSize
            },
            webSearch {
              enabled,
              maxResults,
              provider
            },
            integration {
              internalWeight,
              externalWeight
            }
          }
        `);
        setRAGConfig(data);
      } catch (error) {
        console.error('RAG設定取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();

    // リアルタイム購読
    const subscription = publicClient
      .listen('*[_type == "ragConfiguration"]')
      .subscribe(fetchConfig);

    return () => subscription.unsubscribe();
  }, []);

  return { ragConfig, loading };
}

export function useAIProviderSettings() {
  const [providerSettings, setProviderSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await publicClient.fetch(`
          *[_type == "aiProviderSettings" && active == true][0] {
            name,
            active,
            provider,
            fallbackProviders
          }
        `);
        setProviderSettings(data);
      } catch (error) {
        console.error('AIプロバイダー設定取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // リアルタイム購読
    const subscription = publicClient
      .listen('*[_type == "aiProviderSettings"]')
      .subscribe(fetchSettings);

    return () => subscription.unsubscribe();
  }, []);

  return { providerSettings, loading };
}