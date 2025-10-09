/**
 * 音声コマンド検出システム
 * 「送信」「クリア」などの音声コマンドを検出して実行
 */

export type VoiceCommandType = 'send' | 'clear' | 'cancel' | 'help';

export interface VoiceCommand {
  type: VoiceCommandType;
  patterns: RegExp[];
  description: string;
  action: string;
}

/**
 * 音声コマンドの定義
 */
export const VOICE_COMMANDS: Record<VoiceCommandType, VoiceCommand> = {
  send: {
    type: 'send',
    patterns: [
      /^送信$/,
      /^送って$/,
      /^おくって$/,
      /^送る$/,
      /^おくる$/,
      /送信して$/,
      /送信する$/,
      /これを送信$/,
      /これ送信$/,
      /^おく$/,
      /^送信お願い$/,
      /^送信します$/,
      /^メッセージ送信$/,
      /^メッセージを送って$/,
      /^送ってください$/,
      /^送信してください$/,
      /送って$/i,
      /送信$/i,
    ],
    description: 'メッセージを送信',
    action: 'メッセージを送信します',
  },
  clear: {
    type: 'clear',
    patterns: [
      /^クリア$/,
      /^くりあ$/,
      /^消して$/,
      /^けして$/,
      /^削除$/,
      /^さくじょ$/,
      /クリアして$/,
      /消去$/,
      /全部消して$/,
      /すべて消して$/,
      /^消す$/,
      /^けす$/,
      /^リセット$/,
      /^りせっと$/,
      /^やり直し$/,
      /^やりなおし$/,
      /^入力を消して$/,
      /^テキストを消して$/,
      /^文字を消して$/,
      /消して$/i,
      /クリア$/i,
    ],
    description: '入力をクリア',
    action: '入力をクリアします',
  },
  cancel: {
    type: 'cancel',
    patterns: [
      /^キャンセル$/,
      /^きゃんせる$/,
      /^やめて$/,
      /^中止$/,
      /^ちゅうし$/,
      /^ストップ$/,
      /^すとっぷ$/,
      /^止めて$/,
      /^とめて$/,
      /^やめる$/,
      /^やめます$/,
      /^音声入力を止めて$/,
      /^音声入力やめて$/,
      /^録音を止めて$/,
      /^止まって$/,
      /^終了$/,
      /^しゅうりょう$/,
      /キャンセル$/i,
      /ストップ$/i,
    ],
    description: '音声入力をキャンセル',
    action: '音声入力をキャンセルします',
  },
  help: {
    type: 'help',
    patterns: [
      /^ヘルプ$/,
      /^へるぷ$/,
      /^使い方$/,
      /^つかいかた$/,
      /^コマンド一覧$/,
      /^こまんどいちらん$/,
      /^何ができる$/,
      /^なにができる$/,
      /^どうやって使う$/,
      /^どうやってつかう$/,
      /^教えて$/,
      /^おしえて$/,
      /^ヘルプを見せて$/,
      /^ヘルプください$/,
      /^サポート$/,
      /^さぽーと$/,
      /ヘルプ$/i,
      /使い方$/i,
    ],
    description: 'ヘルプを表示',
    action: 'ヘルプを表示します',
  },
};

/**
 * テキストから音声コマンドを検出
 * @param {string} text - 認識されたテキスト
 * @returns {VoiceCommandType | null} 検出されたコマンドタイプ、なければnull
 */
export function detectVoiceCommand(text: string): VoiceCommandType | null {
  const trimmedText = text.trim();

  // 各コマンドのパターンをチェック
  for (const [commandType, command] of Object.entries(VOICE_COMMANDS)) {
    for (const pattern of command.patterns) {
      if (pattern.test(trimmedText)) {
        console.log('[Voice Command] Detected:', commandType, 'from text:', trimmedText);
        return commandType as VoiceCommandType;
      }
    }
  }

  return null;
}

/**
 * コマンドの説明文を取得
 * @param {VoiceCommandType} commandType - コマンドタイプ
 * @returns {string} 説明文
 */
export function getCommandDescription(commandType: VoiceCommandType): string {
  return VOICE_COMMANDS[commandType]?.description || '';
}

/**
 * コマンドのアクション文を取得
 * @param {VoiceCommandType} commandType - コマンドタイプ
 * @returns {string} アクション文
 */
export function getCommandAction(commandType: VoiceCommandType): string {
  return VOICE_COMMANDS[commandType]?.action || '';
}

/**
 * すべてのコマンドのヘルプテキストを取得
 * @returns {string} ヘルプテキスト
 */
export function getCommandsHelp(): string {
  const helpText = Object.values(VOICE_COMMANDS)
    .map(cmd => `「${cmd.patterns[0].source.replace(/\^|\$/g, '')}」 - ${cmd.description}`)
    .join('\n');

  return `利用可能な音声コマンド:\n${helpText}`;
}

/**
 * テキストがコマンドのみかどうかを判定
 * @param {string} text - テキスト
 * @returns {boolean} コマンドのみの場合true
 */
export function isCommandOnly(text: string): boolean {
  const command = detectVoiceCommand(text);
  return command !== null;
}

/**
 * テキストからコマンドを除去
 * @param {string} text - テキスト
 * @returns {string} コマンドを除去したテキスト
 */
export function removeCommand(text: string): string {
  const trimmedText = text.trim();

  for (const command of Object.values(VOICE_COMMANDS)) {
    for (const pattern of command.patterns) {
      if (pattern.test(trimmedText)) {
        return trimmedText.replace(pattern, '').trim();
      }
    }
  }

  return trimmedText;
}

/**
 * コマンド実行のシミュレーション（デバッグ用）
 * @param {VoiceCommandType} commandType - コマンドタイプ
 */
export function simulateCommand(commandType: VoiceCommandType): void {
  console.log(`[Voice Command] Simulating command: ${commandType}`);
  console.log(`[Voice Command] Action: ${getCommandAction(commandType)}`);
}
