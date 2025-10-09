import { v4 as uuidv4 } from 'uuid';
import { kv } from '@/lib/kv';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // RAG関連メタデータ（オプション）
  sources?: any[];
  confidence?: number;
  provider?: string;
  searchResults?: number;
  webResults?: number;
}

export interface Session {
  id: string;
  startedAt: Date;
  lastActivityAt: Date;
  messages: Message[];
  metadata: Record<string, any>;
  userEmail?: string | null;
  clientIp?: string | null;
}

export class SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60; // 24時間（秒）

  static async createSession(clientIp?: string): Promise<string> {
    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messages: [],
      metadata: {},
      userEmail: null,
      clientIp: clientIp || null
    };

    try {
      // Vercel KVに保存（24時間保持）
      await kv.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        { ex: this.SESSION_TIMEOUT }
      );

      return sessionId;
    } catch (error) {
      console.error('Failed to create session in KV:', error);
      // KVが利用できない場合はセッションIDのみ返す
      return sessionId;
    }
  }

  static async getSession(sessionId: string): Promise<Session | null> {
    try {
      const data = await kv.get(`session:${sessionId}`);

      if (!data) {
        return null;
      }

      const session = JSON.parse(data as string) as Session;

      // 日付を復元
      session.startedAt = new Date(session.startedAt);
      session.lastActivityAt = new Date(session.lastActivityAt);
      session.messages = session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      // 最終アクティビティ時刻を更新
      session.lastActivityAt = new Date();
      await kv.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        { ex: this.SESSION_TIMEOUT }
      );

      return session;
    } catch (error) {
      console.error('Failed to get session from KV:', error);
      return null;
    }
  }

  static async addMessage(
    sessionId: string,
    message: Omit<Message, 'timestamp'>
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId);

      if (!session) {
        console.warn(`Session ${sessionId} not found`);
        return;
      }

      session.messages.push({
        ...message,
        timestamp: new Date()
      });
      session.lastActivityAt = new Date();

      await kv.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        { ex: this.SESSION_TIMEOUT }
      );
    } catch (error) {
      console.error('Failed to add message to session:', error);
    }
  }

  static async setUserEmail(
    sessionId: string,
    email: string
  ): Promise<void> {
    try {
      const session = await this.getSession(sessionId);

      if (!session) {
        console.warn(`Session ${sessionId} not found`);
        return;
      }

      session.userEmail = email;
      session.lastActivityAt = new Date();

      await kv.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        { ex: this.SESSION_TIMEOUT }
      );

      // セッションIDとメールの紐付けも保存
      await kv.set(
        `session_email:${sessionId}`,
        email,
        { ex: this.SESSION_TIMEOUT }
      );
    } catch (error) {
      console.error('Failed to set user email:', error);
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      await kv.del(`session:${sessionId}`);
      await kv.del(`session_email:${sessionId}`);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  static async getSessionCount(): Promise<number> {
    try {
      const keys = await kv.keys('session:*');
      return keys.length;
    } catch (error) {
      console.error('Failed to get session count:', error);
      return 0;
    }
  }

  static async getAllSessions(): Promise<Session[]> {
    try {
      const keys = await kv.keys('session:*');
      const sessions: Session[] = [];

      for (const key of keys) {
        const data = await kv.get(key);
        if (data) {
          const session = JSON.parse(data as string) as Session;
          session.startedAt = new Date(session.startedAt);
          session.lastActivityAt = new Date(session.lastActivityAt);
          sessions.push(session);
        }
      }

      return sessions;
    } catch (error) {
      console.error('Failed to get all sessions:', error);
      return [];
    }
  }
}
