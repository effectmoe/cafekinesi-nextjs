export type FileType = 'pdf' | 'markdown' | 'text' | 'unknown';

export interface ExtractedFile {
  text: string;
  fileType: FileType;
  fileSize: number;
  error?: string;
}

/**
 * ファイルタイプを判定
 */
export function detectFileType(filename: string, mimeType?: string): FileType {
  const extension = filename.toLowerCase().split('.').pop();

  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  if (extension === 'md' || extension === 'markdown') {
    return 'markdown';
  }
  if (extension === 'txt' || mimeType === 'text/plain') {
    return 'text';
  }

  return 'unknown';
}

/**
 * PDFからテキストを抽出
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // pdf-parseを動的にimport（Node.js環境でのみ実行）
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`PDF抽出エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Markdownファイルからテキストを抽出（そのまま返す）
 */
export async function extractMarkdownText(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8').trim();
}

/**
 * テキストファイルからテキストを抽出（そのまま返す）
 */
export async function extractTextFile(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8').trim();
}

/**
 * ファイルからテキストを抽出（統合関数）
 */
export async function extractTextFromFile(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<ExtractedFile> {
  const fileType = detectFileType(filename, mimeType);
  const fileSize = buffer.length;

  try {
    let text: string;

    switch (fileType) {
      case 'pdf':
        text = await extractPdfText(buffer);
        break;
      case 'markdown':
        text = await extractMarkdownText(buffer);
        break;
      case 'text':
        text = await extractTextFile(buffer);
        break;
      default:
        throw new Error(`サポートされていないファイルタイプです: ${filename}`);
    }

    if (!text || text.length === 0) {
      throw new Error('ファイルからテキストを抽出できませんでした（空のコンテンツ）');
    }

    return {
      text,
      fileType,
      fileSize
    };
  } catch (error) {
    return {
      text: '',
      fileType,
      fileSize,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * テキストをチャンクに分割（エンベディング用）
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    chunks.push(text.substring(startIndex, endIndex));
    startIndex += chunkSize - overlap;
  }

  return chunks;
}
