#!/usr/bin/env tsx

/**
 * LLMO (Large Language Model Optimization) 可視性テストスクリプト
 *
 * このスクリプトは、ブログページがAIエージェントから適切に読み取れるかをテストします。
 *
 * テスト項目：
 * 1. Schema.org JSON-LDの存在と妥当性
 * 2. セマンティックHTMLの使用状況
 * 3. 見出し階層の適切性
 * 4. メタデータの完全性
 * 5. コンテンツの構造化
 */

import { readFile } from 'fs/promises'
import { join } from 'path'

interface TestResult {
  category: string
  test: string
  passed: boolean
  details?: string
  score: number
}

interface LLMOTestSuite {
  url: string
  html: string
  results: TestResult[]
  overallScore: number
}

class LLMOTester {
  private html: string = ''
  private results: TestResult[] = []

  constructor(private url: string) {}

  async fetchPage(): Promise<void> {
    try {
      const response = await fetch(this.url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      this.html = await response.text()
    } catch (error) {
      console.error('Failed to fetch page:', error)
      throw error
    }
  }

  /**
   * 1. Schema.org JSON-LDのテスト
   */
  testSchemaOrgJSONLD(): void {
    // BlogPostingスキーマの検証
    const blogPostingRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    const scripts = this.html.matchAll(blogPostingRegex)

    let hasBlogPosting = false
    let hasFAQPage = false
    let hasBreadcrumb = false

    for (const match of scripts) {
      try {
        const json = JSON.parse(match[1])

        if (json['@type'] === 'BlogPosting' || (json['@graph'] && json['@graph'].some((item: any) => item['@type'] === 'BlogPosting'))) {
          hasBlogPosting = true
        }
        if (json['@type'] === 'FAQPage' || (json['@graph'] && json['@graph'].some((item: any) => item['@type'] === 'FAQPage'))) {
          hasFAQPage = true
        }
        if (json['@type'] === 'BreadcrumbList' || (json['@graph'] && json['@graph'].some((item: any) => item['@type'] === 'BreadcrumbList'))) {
          hasBreadcrumb = true
        }
      } catch (e) {
        // JSON parse error
      }
    }

    this.results.push({
      category: 'Schema.org',
      test: 'BlogPosting schema exists',
      passed: hasBlogPosting,
      details: hasBlogPosting ? 'Found BlogPosting schema' : 'BlogPosting schema not found',
      score: hasBlogPosting ? 25 : 0
    })

    this.results.push({
      category: 'Schema.org',
      test: 'Breadcrumb schema exists',
      passed: hasBreadcrumb,
      details: hasBreadcrumb ? 'Found Breadcrumb schema' : 'Breadcrumb schema not found (optional)',
      score: hasBreadcrumb ? 10 : 0
    })

    if (hasFAQPage) {
      this.results.push({
        category: 'Schema.org',
        test: 'FAQPage schema exists',
        passed: true,
        details: 'Found FAQPage schema',
        score: 10
      })
    }
  }

  /**
   * 2. セマンティックHTMLのテスト
   */
  testSemanticHTML(): void {
    const hasArticle = /<article[^>]*>/i.test(this.html)
    const hasMain = /<main[^>]*>/i.test(this.html)
    const hasHeader = /<header[^>]*>/i.test(this.html)
    const hasNav = /<nav[^>]*>/i.test(this.html)
    const hasSection = /<section[^>]*>/i.test(this.html)

    this.results.push({
      category: 'Semantic HTML',
      test: '<article> tag usage',
      passed: hasArticle,
      details: hasArticle ? 'Article tag found' : 'Article tag not found',
      score: hasArticle ? 10 : 0
    })

    this.results.push({
      category: 'Semantic HTML',
      test: '<header> tag usage',
      passed: hasHeader,
      details: hasHeader ? 'Header tag found' : 'Header tag not found',
      score: hasHeader ? 5 : 0
    })

    this.results.push({
      category: 'Semantic HTML',
      test: '<section> tag usage',
      passed: hasSection,
      details: hasSection ? 'Section tag found' : 'Section tag not found',
      score: hasSection ? 5 : 0
    })
  }

  /**
   * 3. 見出し階層のテスト
   */
  testHeadingHierarchy(): void {
    const h1Count = (this.html.match(/<h1[^>]*>/gi) || []).length
    const h2Count = (this.html.match(/<h2[^>]*>/gi) || []).length
    const h3Count = (this.html.match(/<h3[^>]*>/gi) || []).length

    this.results.push({
      category: 'Heading Hierarchy',
      test: 'Single H1 tag',
      passed: h1Count === 1,
      details: `Found ${h1Count} H1 tag(s). Should be exactly 1.`,
      score: h1Count === 1 ? 10 : 0
    })

    this.results.push({
      category: 'Heading Hierarchy',
      test: 'H2 tags present',
      passed: h2Count > 0,
      details: `Found ${h2Count} H2 tag(s)`,
      score: h2Count > 0 ? 5 : 0
    })
  }

  /**
   * 4. メタデータのテスト
   */
  testMetadata(): void {
    const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(this.html)
    const hasDescription = /<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i.test(this.html)
    const hasOGTitle = /<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/i.test(this.html)
    const hasOGImage = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i.test(this.html)

    this.results.push({
      category: 'Metadata',
      test: '<title> tag exists',
      passed: hasTitle,
      details: hasTitle ? 'Title tag found' : 'Title tag not found',
      score: hasTitle ? 5 : 0
    })

    this.results.push({
      category: 'Metadata',
      test: 'Meta description exists',
      passed: hasDescription,
      details: hasDescription ? 'Meta description found' : 'Meta description not found',
      score: hasDescription ? 5 : 0
    })

    this.results.push({
      category: 'Metadata',
      test: 'OpenGraph title exists',
      passed: hasOGTitle,
      details: hasOGTitle ? 'OG title found' : 'OG title not found',
      score: hasOGTitle ? 5 : 0
    })

    this.results.push({
      category: 'Metadata',
      test: 'OpenGraph image exists',
      passed: hasOGImage,
      details: hasOGImage ? 'OG image found' : 'OG image not found',
      score: hasOGImage ? 5 : 0
    })
  }

  /**
   * 5. コンテンツの構造化テスト
   */
  testContentStructure(): void {
    const hasTLDR = /tl;?dr/i.test(this.html)
    const hasTOC = /目次|table of contents/i.test(this.html)
    const hasCode = /<code[^>]*>/i.test(this.html)

    if (hasTLDR) {
      this.results.push({
        category: 'Content Structure',
        test: 'TL;DR section exists',
        passed: true,
        details: 'TL;DR section found (LLMO optimization)',
        score: 10
      })
    }

    if (hasTOC) {
      this.results.push({
        category: 'Content Structure',
        test: 'Table of Contents exists',
        passed: true,
        details: 'TOC found',
        score: 5
      })
    }
  }

  /**
   * すべてのテストを実行
   */
  async runAllTests(): Promise<LLMOTestSuite> {
    console.log(`\n🔍 Testing LLMO visibility for: ${this.url}\n`)

    await this.fetchPage()

    this.testSchemaOrgJSONLD()
    this.testSemanticHTML()
    this.testHeadingHierarchy()
    this.testMetadata()
    this.testContentStructure()

    const overallScore = this.results.reduce((sum, result) => sum + result.score, 0)

    return {
      url: this.url,
      html: this.html,
      results: this.results,
      overallScore
    }
  }

  /**
   * テスト結果を表示
   */
  static displayResults(testSuite: LLMOTestSuite): void {
    console.log('📊 Test Results:\n')
    console.log('━'.repeat(80))

    let currentCategory = ''
    testSuite.results.forEach(result => {
      if (result.category !== currentCategory) {
        currentCategory = result.category
        console.log(`\n📁 ${currentCategory}`)
        console.log('─'.repeat(80))
      }

      const icon = result.passed ? '✅' : '❌'
      console.log(`  ${icon} ${result.test}`)
      if (result.details) {
        console.log(`     └─ ${result.details}`)
      }
      console.log(`     Score: ${result.score}`)
    })

    console.log('\n' + '━'.repeat(80))
    console.log(`\n🎯 Overall Score: ${testSuite.overallScore}/100`)

    let rating = ''
    let emoji = ''
    if (testSuite.overallScore >= 90) {
      rating = 'Excellent'
      emoji = '🌟'
    } else if (testSuite.overallScore >= 75) {
      rating = 'Good'
      emoji = '👍'
    } else if (testSuite.overallScore >= 60) {
      rating = 'Fair'
      emoji = '⚠️'
    } else {
      rating = 'Needs Improvement'
      emoji = '🔴'
    }

    console.log(`${emoji}  Rating: ${rating}`)
    console.log('\n')
  }
}

// メイン実行
async function main() {
  const url = process.argv[2] || 'http://localhost:3000/blog/test-post'

  const tester = new LLMOTester(url)
  const results = await tester.runAllTests()
  LLMOTester.displayResults(results)

  // スコアが低い場合は終了コード1を返す
  if (results.overallScore < 60) {
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { LLMOTester, LLMOTestSuite, TestResult }
