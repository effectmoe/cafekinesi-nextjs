import { Message } from '../chat/session-manager';

export interface EmailTemplateOptions {
  siteName?: string;
  siteUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const defaultOptions: EmailTemplateOptions = {
  siteName: 'Cafe Kinesi',
  siteUrl: 'https://cafekinesi.com',
  logoUrl: '',
  primaryColor: '#007bff',
  secondaryColor: '#f1f1f1'
};

/**
 * チャット履歴をHTMLメールに変換
 */
export function generateEmailHTML(
  messages: Message[],
  options: EmailTemplateOptions = {}
): string {
  const opts = { ...defaultOptions, ...options };

  const messageHTML = messages
    .map((msg) => {
      const isUser = msg.role === 'user';
      const bgColor = isUser ? opts.primaryColor : opts.secondaryColor;
      const textColor = isUser ? '#ffffff' : '#333333';
      const alignment = isUser ? 'right' : 'left';

      const timestamp = new Date(msg.timestamp).toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <tr>
          <td style="padding: 8px 0;">
            <div style="
              background-color: ${bgColor};
              color: ${textColor};
              padding: 15px;
              border-radius: 10px;
              max-width: 70%;
              margin: 0 auto;
              text-align: ${alignment};
              word-wrap: break-word;
            ">
              <div style="margin-bottom: 8px;">
                ${escapeHtml(msg.content)}
              </div>
              <div style="
                font-size: 0.8em;
                opacity: 0.7;
                margin-top: 5px;
              ">
                ${timestamp}
              </div>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${opts.siteName} チャット履歴</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, ${opts.primaryColor} 0%, #0056b3 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-body {
      padding: 20px;
    }
    .email-footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 0.9em;
      color: #6c757d;
      border-top: 1px solid #dee2e6;
    }
    a {
      color: ${opts.primaryColor};
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- ヘッダー -->
    <div class="email-header">
      ${opts.logoUrl ? `<img src="${opts.logoUrl}" alt="${opts.siteName}" style="max-width: 150px; margin-bottom: 10px;">` : ''}
      <h1 style="margin: 10px 0; font-size: 24px;">💬 チャット履歴</h1>
      <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">
        ${new Date().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>

    <!-- 本文 -->
    <div class="email-body">
      <p style="margin-bottom: 20px; color: #333;">
        ${opts.siteName}でのチャット履歴をお送りします。
      </p>

      <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        ${messageHTML}
      </table>

      <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="margin: 0; font-size: 0.9em; color: #6c757d;">
          📌 このメールは、お客様がチャット履歴の保存を希望されたため送信されています。
        </p>
      </div>
    </div>

    <!-- フッター -->
    <div class="email-footer">
      <p style="margin: 10px 0;">
        <a href="${opts.siteUrl}" style="font-weight: bold;">${opts.siteName}</a>
      </p>
      <p style="margin: 10px 0; font-size: 0.85em;">
        〒xxx-xxxx 東京都○○区○○<br>
        お問い合わせ: <a href="mailto:info@${opts.siteUrl.replace('https://', '').replace('http://', '')}">info@cafekinesi.com</a>
      </p>
      <p style="margin: 15px 0 5px; font-size: 0.8em; color: #adb5bd;">
        このメールは送信専用です。返信はできません。
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * プレーンテキスト版のメール本文を生成
 */
export function generatePlainText(messages: Message[]): string {
  const messageText = messages
    .map((msg) => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString('ja-JP');
      const role = msg.role === 'user' ? 'あなた' : 'AI';
      return `[${timestamp}] ${role}:\n${msg.content}\n`;
    })
    .join('\n');

  return `
Cafe Kinesi チャット履歴

${new Date().toLocaleDateString('ja-JP')}

${messageText}

---
このメールは、お客様がチャット履歴の保存を希望されたため送信されています。

Cafe Kinesi
https://cafekinesi.com
  `;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  const div = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // 改行をHTMLの改行に変換
  return div.replace(/\n/g, '<br>');
}
