#!/usr/bin/env npx tsx

import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: 'e4aqw590',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

async function checkCourses() {
  console.log('📚 講座データを確認中...\n')

  try {
    // 1. すべての講座を取得
    const courses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) {
      _id,
      title,
      courseId,
      description,
      price,
      duration,
      isActive
    }`)

    console.log(`📋 取得した講座数: ${courses.length}件\n`)

    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`)
      console.log(`   ID: ${course.courseId || course._id}`)
      console.log(`   価格: ${course.price || '未設定'}`)
      console.log(`   期間: ${course.duration || '未設定'}`)
      console.log(`   有効: ${course.isActive !== false ? 'Yes' : 'No'}`)
      console.log(`   説明: ${course.description?.substring(0, 100) || '説明なし'}...`)
      console.log('')
    })

    // 2. Serviceエンティティも確認
    const services = await client.fetch(`*[_type == "service"] {
      _id,
      name,
      serviceType,
      category,
      isActive
    }`)

    console.log(`\n🎓 AI-First Serviceエンティティ数: ${services.length}件`)
    if (services.length > 0) {
      services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.name} (${service.serviceType})`)
      })
    } else {
      console.log('   ⚠️  Serviceエンティティが見つかりません')
    }

    // 3. 講座関連のベクトルデータベース確認用データ
    console.log('\n📊 問題の分析:')

    const activeCourses = courses.filter(c => c.isActive !== false)
    console.log(`- アクティブな講座: ${activeCourses.length}件`)
    console.log(`- AI-First Services: ${services.length}件`)

    if (activeCourses.length > 3 && services.length === 0) {
      console.log('\n❌ 問題特定: 講座データはあるが、AI-First Serviceエンティティが不足')
      console.log('   解決方法: 講座データをServiceエンティティに移行する必要があります')
    }

  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

checkCourses()