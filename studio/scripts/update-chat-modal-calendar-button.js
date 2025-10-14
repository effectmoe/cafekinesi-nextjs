import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function updateChatModal() {
  console.log('🎯 チャットモーダルにカレンダーボタン設定を追加します...\n')

  try {
    // 既存のチャットモーダル設定を取得
    const existingModal = await client.fetch('*[_type == "chatModal"][0]')

    if (!existingModal) {
      console.error('❌ チャットモーダル設定が見つかりません')
      return
    }

    console.log(`📝 更新中: ${existingModal._id}`)

    // カレンダーボタン設定を追加
    const result = await client
      .patch(existingModal._id)
      .set({
        calendarButtonEnabled: true,
        calendarButtonText: 'イベントの予定を見る',
        calendarButtonUrl: '/calendar'
      })
      .commit()

    console.log(`✅ 更新完了: ${result._id}`)
    console.log('\n🎉 カレンダーボタン設定を追加しました！')
    console.log('📱 トップページのチャットモーダルで確認してください: http://localhost:3003')
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
  }
}

updateChatModal()
