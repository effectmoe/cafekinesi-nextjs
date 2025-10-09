import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { SessionManager, Message } from '@/lib/chat/session-manager';
import { generateEmailHTML, generatePlainText } from '@/lib/email/template';
import { updateLogsWithEmail, exportLogsToNotion } from '@/lib/notion/export';

// Node.js runtimeを使用（nodemailerはEdge Runtimeでは動作しない）
export const runtime = 'nodejs';

/**
 * メール送信API
 * POST /api/chat/send-email
 */
export async function POST(request: NextRequest) {
  try {
    // nodemailerを動的にインポート（CommonJS/ESMの互換性問題を回避）
    const nodemailerModule = await import('nodemailer');
    const nodemailer = nodemailerModule.default || nodemailerModule;

    const { email, sessionId, messages } = await request.json();

    // バリデーション
    if (!email || !sessionId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      );
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '正しいメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    // レート制限チェック（1時間に5通まで）
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    const rateLimitKey = `email_rate:${clientIp}`;
    const currentCount = await kv.get(rateLimitKey) || 0;

    if (typeof currentCount === 'number' && currentCount >= 5) {
      return NextResponse.json(
        { error: '送信制限に達しました。1時間後に再度お試しください。' },
        { status: 429 }
      );
    }

    // セッションIDとメールアドレスを紐付け
    await SessionManager.setUserEmail(sessionId, email);

    // IPアドレスとメールアドレスも紐付け（バックアップ）
    await kv.set(`ip_email:${clientIp}`, email, { ex: 86400 }); // 24時間保持

    // 既存ログにメールアドレスを追記
    const updatedCount = await updateLogsWithEmail(sessionId, clientIp, email);
    console.log(`Updated ${updatedCount} logs with email: ${email}`);

    // HTMLメール生成
    const htmlContent = generateEmailHTML(messages, {
      siteName: 'Cafe Kinesi',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cafekinesi.com',
      primaryColor: '#007bff'
    });

    // プレーンテキスト生成
    const textContent = generatePlainText(messages);

    // メール送信設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // メール送信
    const mailOptions = {
      from: `"Cafe Kinesi" <${process.env.EMAIL_USER}>`,
      to: email,
      bcc: process.env.ADMIN_EMAIL, // 管理者にBCC
      subject: '💬 Cafe Kinesi チャット履歴',
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: email,
      sessionId
    });

    // レート制限カウンターを更新
    await kv.incr(rateLimitKey);
    await kv.expire(rateLimitKey, 3600); // 1時間

    // 🆕 メール送信成功後、即座にNotionにエクスポート
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log(`📤 Exporting today's logs (${today}) to Notion...`);

      const exportResult = await exportLogsToNotion(today);

      console.log('✅ Notion export completed:', {
        success: exportResult.success,
        skipped: exportResult.skipped,
        errors: exportResult.errors
      });
    } catch (notionError) {
      // Notionエクスポートエラーはメール送信結果に影響させない
      console.error('⚠️ Notion export failed (non-critical):', notionError);
    }

    return NextResponse.json({
      success: true,
      message: 'メールを送信しました',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('メール送信エラー:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'メール送信に失敗しました',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'メール送信に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - CORS対応
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
