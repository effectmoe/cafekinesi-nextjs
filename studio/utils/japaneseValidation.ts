/**
 * 日本語バリデーションユーティリティ
 * すべてのバリデーションメッセージを日本語化するためのヘルパー関数
 */

import { Rule } from 'sanity'

/**
 * 必須フィールドのバリデーション（日本語エラーメッセージ付き）
 */
export const requiredJP = (Rule: Rule, fieldName?: string) => {
  return Rule.required().error(
    fieldName ? `${fieldName}は必須項目です` : 'この項目は必須です'
  )
}

/**
 * 最小文字数のバリデーション（日本語エラーメッセージ付き）
 */
export const minLengthJP = (Rule: Rule, min: number, fieldName?: string) => {
  return Rule.min(min).error(
    fieldName
      ? `${fieldName}は${min}文字以上で入力してください`
      : `${min}文字以上で入力してください`
  )
}

/**
 * 最大文字数のバリデーション（日本語エラーメッセージ付き）
 */
export const maxLengthJP = (Rule: Rule, max: number, fieldName?: string) => {
  return Rule.max(max).error(
    fieldName
      ? `${fieldName}は${max}文字以内で入力してください`
      : `${max}文字以内で入力してください`
  )
}

/**
 * 文字数範囲のバリデーション（日本語エラーメッセージ付き）
 */
export const lengthRangeJP = (Rule: Rule, min: number, max: number, fieldName?: string) => {
  return Rule.min(min).max(max).error(
    fieldName
      ? `${fieldName}は${min}〜${max}文字で入力してください`
      : `${min}〜${max}文字で入力してください`
  )
}

/**
 * 最小値のバリデーション（日本語エラーメッセージ付き）
 */
export const minValueJP = (Rule: Rule, min: number, fieldName?: string) => {
  return Rule.min(min).error(
    fieldName
      ? `${fieldName}は${min}以上の値を入力してください`
      : `${min}以上の値を入力してください`
  )
}

/**
 * 最大値のバリデーション（日本語エラーメッセージ付き）
 */
export const maxValueJP = (Rule: Rule, max: number, fieldName?: string) => {
  return Rule.max(max).error(
    fieldName
      ? `${fieldName}は${max}以下の値を入力してください`
      : `${max}以下の値を入力してください`
  )
}

/**
 * 配列の最小要素数のバリデーション（日本語エラーメッセージ付き）
 */
export const minItemsJP = (Rule: Rule, min: number, fieldName?: string) => {
  return Rule.min(min).error(
    fieldName
      ? `${fieldName}は${min}個以上選択してください`
      : `${min}個以上選択してください`
  )
}

/**
 * 配列の最大要素数のバリデーション（日本語エラーメッセージ付き）
 */
export const maxItemsJP = (Rule: Rule, max: number, fieldName?: string) => {
  return Rule.max(max).error(
    fieldName
      ? `${fieldName}は${max}個以内で選択してください`
      : `${max}個以内で選択してください`
  )
}

/**
 * URLのバリデーション（日本語エラーメッセージ付き）
 */
export const urlJP = (Rule: Rule, fieldName?: string) => {
  return Rule.uri({
    scheme: ['http', 'https'],
    allowRelative: false
  }).error(
    fieldName
      ? `${fieldName}には有効なURL（http://またはhttps://）を入力してください`
      : '有効なURL（http://またはhttps://）を入力してください'
  )
}

/**
 * メールアドレスのバリデーション（日本語エラーメッセージ付き）
 */
export const emailJP = (Rule: Rule, fieldName?: string) => {
  return Rule.email().error(
    fieldName
      ? `${fieldName}には有効なメールアドレスを入力してください`
      : '有効なメールアドレスを入力してください'
  )
}

/**
 * カスタム正規表現のバリデーション（日本語エラーメッセージ付き）
 */
export const regexJP = (
  Rule: Rule,
  pattern: RegExp,
  errorMessage: string
) => {
  return Rule.regex(pattern).error(errorMessage)
}

/**
 * 必須 + 最小文字数のバリデーション（組み合わせ）
 */
export const requiredMinJP = (Rule: Rule, min: number, fieldName?: string) => {
  return Rule.required()
    .min(min)
    .error(
      fieldName
        ? `${fieldName}は必須項目です（${min}文字以上）`
        : `この項目は必須です（${min}文字以上）`
    )
}

/**
 * 必須 + 最大文字数のバリデーション（組み合わせ）
 */
export const requiredMaxJP = (Rule: Rule, max: number, fieldName?: string) => {
  return Rule.required()
    .max(max)
    .error(
      fieldName
        ? `${fieldName}は必須項目です（${max}文字以内）`
        : `この項目は必須です（${max}文字以内）`
    )
}

/**
 * 必須 + 文字数範囲のバリデーション（組み合わせ）
 */
export const requiredLengthRangeJP = (
  Rule: Rule,
  min: number,
  max: number,
  fieldName?: string
) => {
  return Rule.required()
    .min(min)
    .max(max)
    .error(
      fieldName
        ? `${fieldName}は必須項目です（${min}〜${max}文字）`
        : `この項目は必須です（${min}〜${max}文字）`
    )
}
