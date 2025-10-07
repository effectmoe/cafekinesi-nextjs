import { v4 as uuidv4 } from 'uuid';

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
}

// グローバルにセッションを保存（Next.js HMR対応）
const globalForSessions = globalThis as unknown as {
  sessions: Map<string, Session> | undefined;
};

export class SessionManager {
  private static sessions = globalForSessions.sessions ?? new Map<string, Session>();
  private static readonly MAX_SESSIONS = 100;
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30分

  static {
    // グローバルに保存
    if (!globalForSessions.sessions) {
      globalForSessions.sessions = SessionManager.sessions;
    }
  }

  static createSession(): string {
    // 古いセッションをクリーンアップ
    this.cleanup();

    // セッション数制限チェック
    if (this.sessions.size >= this.MAX_SESSIONS) {
      this.removeOldestSession();
    }

    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      messages: [],
      metadata: {}
    };

    this.sessions.set(sessionId, session);

    // タイムアウト設定
    setTimeout(() => {
      this.deleteSession(sessionId);
    }, this.SESSION_TIMEOUT);

    return sessionId;
  }

  static getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivityAt = new Date();
    }
    return session || null;
  }

  static addMessage(sessionId: string, message: Omit<Message, 'timestamp'>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push({
        ...message,
        timestamp: new Date()
      });
      session.lastActivityAt = new Date();
    }
  }

  static deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private static cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActivityAt.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(id);
      }
    }
  }

  private static removeOldestSession(): void {
    let oldestSession: [string, Session] | null = null;

    for (const entry of this.sessions.entries()) {
      if (!oldestSession || entry[1].lastActivityAt < oldestSession[1].lastActivityAt) {
        oldestSession = entry;
      }
    }

    if (oldestSession) {
      this.sessions.delete(oldestSession[0]);
    }
  }

  static getSessionCount(): number {
    return this.sessions.size;
  }

  static getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }
}
