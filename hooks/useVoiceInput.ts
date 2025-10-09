/**
 * useVoiceInput カスタムフック
 * Web Speech API を使用した音声入力機能を提供
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  VoiceInputOptions,
  VoiceInputError,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  CorrectionDictionary,
} from '@/types/voice-input.types';
import {
  detectDevice,
  getSpeechRecognitionConfig,
  checkWebSpeechSupport,
} from '@/lib/voice/device-detector';
import { applyCorrections } from '@/lib/voice/corrections';
import { addPunctuation } from '@/lib/voice/punctuation';
import { getCachedDynamicCorrections } from '@/lib/voice/dynamic-corrections';

/**
 * 音声入力カスタムフック
 * @param {VoiceInputOptions} options - フックのオプション
 * @returns 音声入力の状態と制御関数
 */
export function useVoiceInput(options: VoiceInputOptions) {
  const {
    onResult,
    onError,
    onStart,
    onEnd,
    language = 'ja-JP',
    continuous,
    interimResults = true,
    autoCorrect = true,
    autoPunctuation = true,
  } = options;

  // 状態管理
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<VoiceInputError | null>(null);
  const [dynamicDictionary, setDynamicDictionary] = useState<CorrectionDictionary>({});

  // 参照管理（再レンダリング時も維持）
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isVoiceInputRef = useRef(false);

  // Web Speech APIサポート確認（初回のみ）
  useEffect(() => {
    const supported = checkWebSpeechSupport();
    setIsSupported(supported);

    if (!supported) {
      console.warn('[useVoiceInput] Web Speech API is not supported in this browser');
    }
  }, []);

  // 動的辞書の取得（初回のみ）
  useEffect(() => {
    const loadDynamicDictionary = async () => {
      try {
        const dictionary = await getCachedDynamicCorrections();
        setDynamicDictionary(dictionary);
        console.log('[useVoiceInput] Loaded dynamic dictionary with', Object.keys(dictionary).length, 'entries');
      } catch (error) {
        console.error('[useVoiceInput] Failed to load dynamic dictionary:', error);
      }
    };

    loadDynamicDictionary();
  }, []);

  /**
   * エラーコードをVoiceInputErrorに変換
   */
  const convertError = useCallback((errorCode: string): VoiceInputError => {
    const errorMap: Record<string, VoiceInputError> = {
      'not-allowed': 'not-allowed',
      'no-speech': 'no-speech',
      'aborted': 'aborted',
      'audio-capture': 'audio-capture',
      'network': 'network',
      'service-not-allowed': 'service-not-allowed',
    };

    return errorMap[errorCode] || 'unknown';
  }, []);

  /**
   * テキストを処理（修正＋句読点追加）
   */
  const processText = useCallback((text: string): string => {
    let processed = text;

    // 固有名詞変換（動的辞書を含む）
    if (autoCorrect) {
      processed = applyCorrections(processed, {
        dynamicDictionary,
      });
    }

    // 句読点自動追加
    if (autoPunctuation && isVoiceInputRef.current) {
      processed = addPunctuation(processed, true);
    }

    return processed;
  }, [autoCorrect, autoPunctuation, dynamicDictionary]);

  /**
   * 音声認識を開始
   */
  const startRecording = useCallback(() => {
    if (!isSupported) {
      const notSupportedError: VoiceInputError = 'not-supported';
      setError(notSupportedError);
      onError?.(notSupportedError);
      return;
    }

    if (isRecording) {
      console.warn('[useVoiceInput] Recognition is already running');
      return;
    }

    try {
      // SpeechRecognitionインスタンスを作成
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // デバイスに応じた設定を取得
      const deviceType = detectDevice();
      const config = getSpeechRecognitionConfig(deviceType, language);

      // 設定を適用（オプションが指定されていれば優先）
      recognition.continuous = continuous !== undefined ? continuous : config.continuous;
      recognition.interimResults = interimResults;
      recognition.lang = config.lang;
      recognition.maxAlternatives = config.maxAlternatives;

      // イベントハンドラー: 開始時
      recognition.onstart = () => {
        console.log('[useVoiceInput] Recognition started');
        setIsRecording(true);
        setError(null);
        isVoiceInputRef.current = true;
        onStart?.();
      };

      // イベントハンドラー: 結果受信時
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimText = '';
        let finalText = '';

        // 最新の結果のみを処理
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript;

          if (result.isFinal) {
            finalText = transcriptText;
          } else {
            interimText = transcriptText;
          }
        }

        // 途中結果を表示
        if (interimText) {
          setInterimTranscript(interimText);
        }

        // 確定結果を処理
        if (finalText) {
          const processedText = processText(finalText);
          setTranscript(processedText);
          setInterimTranscript('');
          onResult(processedText);
        }
      };

      // イベントハンドラー: 終了時
      recognition.onend = () => {
        console.log('[useVoiceInput] Recognition ended');
        setIsRecording(false);
        setInterimTranscript('');
        isVoiceInputRef.current = false;
        onEnd?.();
        recognitionRef.current = null;
      };

      // イベントハンドラー: エラー時
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('[useVoiceInput] Recognition error:', event.error);
        const voiceError = convertError(event.error);
        setError(voiceError);
        onError?.(voiceError);
        setIsRecording(false);
        isVoiceInputRef.current = false;
      };

      // 認識開始
      recognition.start();
      recognitionRef.current = recognition;

    } catch (err) {
      console.error('[useVoiceInput] Failed to start recognition:', err);
      const unknownError: VoiceInputError = 'unknown';
      setError(unknownError);
      onError?.(unknownError);
      setIsRecording(false);
    }
  }, [
    isSupported,
    isRecording,
    language,
    continuous,
    interimResults,
    convertError,
    processText,
    onResult,
    onError,
    onStart,
    onEnd,
  ]);

  /**
   * 音声認識を停止
   */
  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      console.log('[useVoiceInput] Stopping recognition');
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  /**
   * 音声認識を中断（即座に終了）
   */
  const abortRecording = useCallback(() => {
    if (recognitionRef.current) {
      console.log('[useVoiceInput] Aborting recognition');
      recognitionRef.current.abort();
      setIsRecording(false);
      isVoiceInputRef.current = false;
      recognitionRef.current = null;
    }
  }, []);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * クリーンアップ: アンマウント時に認識を停止
   */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isRecording,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startRecording,
    stopRecording,
    abortRecording,
    clearError,
  };
}
