/**
 * 動的固有名詞変換辞書
 * Sanityから取得したデータを元に、変換辞書を動的に生成
 */

'use client';

import { publicClient } from '@/lib/sanity.client';
import { CorrectionDictionary } from '@/types/voice-input.types';

// コース情報の型定義
interface Course {
  _id: string;
  title: string;
  courseId?: string;
  subtitle?: string;
}

// インストラクター情報の型定義
interface Instructor {
  _id: string;
  name: string;
  title?: string;
  specialties?: string[];
}

/**
 * Sanityからコース名を取得
 * @returns {Promise<Course[]>} コース一覧
 */
async function fetchCourses(): Promise<Course[]> {
  try {
    const courses = await publicClient.fetch<Course[]>(`
      *[_type == "course" && isActive == true] {
        _id,
        title,
        courseId,
        subtitle
      }
    `);
    return courses || [];
  } catch (error) {
    console.error('[Dynamic Corrections] Failed to fetch courses:', error);
    return [];
  }
}

/**
 * Sanityからインストラクター名を取得
 * @returns {Promise<Instructor[]>} インストラクター一覧
 */
async function fetchInstructors(): Promise<Instructor[]> {
  try {
    const instructors = await publicClient.fetch<Instructor[]>(`
      *[_type == "instructor" && isActive == true] {
        _id,
        name,
        title,
        specialties
      }
    `);
    return instructors || [];
  } catch (error) {
    console.error('[Dynamic Corrections] Failed to fetch instructors:', error);
    return [];
  }
}

/**
 * コース名から音声認識パターンを生成
 * @param {string} title - コース名
 * @returns {string[]} 音声認識パターン（ひらがな、カタカナ）
 */
function generateVoicePatterns(title: string): string[] {
  const patterns: string[] = [];

  // ひらがな変換（簡易版）
  const hiraganaMap: Record<string, string> = {
    'ピーチタッチ': 'ぴーちたっち',
    'チャクラキネシ': 'ちゃくらきねし',
    'キネシ': 'きねし',
    'カフェキネシ': 'かふぇきねし',
    'タッチフォーヘルス': 'たっちふぉーへるす',
    'インナーチャイルド': 'いんなーちゃいるど',
  };

  // カタカナをひらがなに変換
  Object.entries(hiraganaMap).forEach(([katakana, hiragana]) => {
    if (title.includes(katakana)) {
      patterns.push(hiragana);
    }
  });

  return patterns;
}

/**
 * コース一覧から変換辞書を生成
 * @param {Course[]} courses - コース一覧
 * @returns {CorrectionDictionary} 変換辞書
 */
function generateCourseDictionary(courses: Course[]): CorrectionDictionary {
  const dictionary: CorrectionDictionary = {};

  courses.forEach(course => {
    // コース名の音声認識パターンを生成
    const patterns = generateVoicePatterns(course.title);

    patterns.forEach(pattern => {
      dictionary[pattern] = course.title;
    });

    // courseIdがあれば追加
    if (course.courseId) {
      dictionary[course.courseId] = course.title;
    }
  });

  return dictionary;
}

/**
 * インストラクター一覧から変換辞書を生成
 * @param {Instructor[]} instructors - インストラクター一覧
 * @returns {CorrectionDictionary} 変換辞書
 */
function generateInstructorDictionary(instructors: Instructor[]): CorrectionDictionary {
  const dictionary: CorrectionDictionary = {};

  instructors.forEach(instructor => {
    // インストラクター名をそのまま登録
    // 例: 「ほしゆかり」→「星 ゆかり」などの変換
    if (instructor.name) {
      dictionary[instructor.name.toLowerCase()] = instructor.name;
    }

    // 専門分野も辞書に追加
    if (instructor.specialties) {
      instructor.specialties.forEach(specialty => {
        if (specialty) {
          dictionary[specialty.toLowerCase()] = specialty;
        }
      });
    }
  });

  return dictionary;
}

/**
 * Sanityから動的に固有名詞変換辞書を生成
 * @returns {Promise<CorrectionDictionary>} 変換辞書
 */
export async function generateDynamicCorrections(): Promise<CorrectionDictionary> {
  try {
    // 並列でデータ取得
    const [courses, instructors] = await Promise.all([
      fetchCourses(),
      fetchInstructors(),
    ]);

    // 各辞書を生成
    const courseDictionary = generateCourseDictionary(courses);
    const instructorDictionary = generateInstructorDictionary(instructors);

    // 統合辞書を作成
    const dynamicDictionary: CorrectionDictionary = {
      ...courseDictionary,
      ...instructorDictionary,
    };

    console.log('[Dynamic Corrections] Generated dictionary with', Object.keys(dynamicDictionary).length, 'entries');

    return dynamicDictionary;
  } catch (error) {
    console.error('[Dynamic Corrections] Failed to generate dynamic corrections:', error);
    return {};
  }
}

/**
 * キャッシュ機能付きの動的辞書取得
 * @param {number} cacheTime - キャッシュ時間（ミリ秒、デフォルト: 30分）
 * @returns {Promise<CorrectionDictionary>} 変換辞書
 */
let cachedDictionary: CorrectionDictionary | null = null;
let lastFetchTime: number = 0;

export async function getCachedDynamicCorrections(
  cacheTime: number = 30 * 60 * 1000 // 30分
): Promise<CorrectionDictionary> {
  const now = Date.now();

  // キャッシュが有効な場合は返す
  if (cachedDictionary && (now - lastFetchTime) < cacheTime) {
    console.log('[Dynamic Corrections] Using cached dictionary');
    return cachedDictionary;
  }

  // キャッシュが無効な場合は再取得
  console.log('[Dynamic Corrections] Fetching new dictionary');
  cachedDictionary = await generateDynamicCorrections();
  lastFetchTime = now;

  return cachedDictionary;
}

/**
 * キャッシュをクリア
 */
export function clearCorrectionCache(): void {
  cachedDictionary = null;
  lastFetchTime = 0;
  console.log('[Dynamic Corrections] Cache cleared');
}
