'use client';

import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
  messageCount: number;
}

export const EmailModal = ({ isOpen, onClose, onSend, messageCount }: EmailModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    setError('');

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail(email)) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      await onSend(email);
      setEmail('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メール送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(260,30%,75%)] to-[hsl(260,30%,65%)] flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  会話を保存
                </h3>
                <p className="text-xs text-text-secondary">
                  {messageCount}件のメッセージをメールで送信
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-secondary hover:text-text-primary"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(260,30%,75%)] text-sm text-text-primary placeholder:text-text-muted disabled:opacity-50 transition-all bg-[hsl(35,25%,97%)] border-border/50"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              📧 チャット履歴がHTMLメールとして送信されます
            </p>
            <p className="text-xs text-blue-600 mt-1">
              💡 管理者にもBCCで送信されます
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              className="flex-1 bg-gradient-to-br from-[hsl(260,30%,75%)] to-[hsl(260,30%,65%)] hover:from-[hsl(260,30%,70%)] hover:to-[hsl(260,30%,60%)] text-white"
              onClick={handleSend}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  送信中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  送信
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
