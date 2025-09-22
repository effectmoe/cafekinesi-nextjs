// Sanity configuration with hardcoded fallback values
// This ensures the app works even if environment variables have issues

export const sanityConfig = {
  // プロジェクトID（必須）
  projectId: 'e4aqw590',

  // データセット
  dataset: 'production',

  // APIバージョン
  apiVersion: '2024-01-01',

  // CDN使用フラグ（本番環境では無効に）
  useCdn: false,

  // APIトークン（読み取り専用）
  apiToken: 'skmH5807aTZkc80e9wXtUGh6YGxvS9fmTcsxwG0vDPy9XPJ3lTpX7wYmAXl5SKy1HEOllZf3NDEg1ULmn'
} as const

// 環境変数から値を取得する関数
// 現在は環境変数の問題を回避するため、ハードコードされた値のみを使用
export function getSanityConfig() {
  // 環境変数の問題が解決するまで、ハードコードされた値を直接返す
  return sanityConfig;

  // 以下は環境変数が正しく設定された後に有効化
  /*
  const clean = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    return value.replace(/[\r\n\t]/g, '').trim();
  };

  return {
    projectId: clean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) || sanityConfig.projectId,
    dataset: clean(process.env.NEXT_PUBLIC_SANITY_DATASET) || sanityConfig.dataset,
    apiVersion: clean(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || sanityConfig.apiVersion,
    useCdn: process.env.NEXT_PUBLIC_SANITY_USE_CDN === 'false' ? false : sanityConfig.useCdn,
    apiToken: clean(process.env.NEXT_PUBLIC_SANITY_API_TOKEN) || sanityConfig.apiToken,
  };
  */
}