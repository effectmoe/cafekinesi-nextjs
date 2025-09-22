import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // publicフォルダのパスを取得
    const jsonPath = path.join(process.cwd(), 'public', 'blog-posts.json')

    // ファイルが存在するか確認
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({
        error: 'File not found',
        path: jsonPath,
        cwd: process.cwd()
      }, { status: 404 })
    }

    // JSONファイルを読み込む
    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const posts = JSON.parse(jsonData)

    return NextResponse.json({
      success: true,
      posts: posts,
      count: posts.length,
      path: jsonPath
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      cwd: process.cwd()
    }, { status: 500 })
  }
}