export class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(sessionId: string, limit = 30): boolean {
    const now = Date.now();
    const minute = 60 * 1000;
    const requests = this.requests.get(sessionId) || [];

    // 1分以内のリクエストをフィルタ
    const recentRequests = requests.filter(t => now - t < minute);

    if (recentRequests.length >= limit) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(sessionId, recentRequests);
    return true;
  }

  clear(sessionId: string): void {
    this.requests.delete(sessionId);
  }

  clearAll(): void {
    this.requests.clear();
  }
}
